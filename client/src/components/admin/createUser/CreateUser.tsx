/**
 * CreateUser.tsx
 * Renders the component to create a new user.
 */

// Modules.
import Backdrop from '@material-ui/core/Backdrop';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Input from '../../forms/input/Input'; 
import Modal from '@material-ui/core/Modal';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import API from '../../../utils/api/Api.model';
import StyledButton from '../../elements/buttons/StyledButton';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
import {
  CreateUserFormResponse,
  CreateUserProps
} from './CreateUser.interface';
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../../user/User.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  isEmail,
  allowedCharacters,
  isPassword,
  isRequired,
  handleAvailable,
  minLength
} from '../../forms/validation/ValidationRules';

/**
 * Create styles for the review screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  formContainer: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    margin: theme.spacing(2),
    maxWidth: 600,
    outline: 0,
    padding: theme.spacing(2)
  },
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    outline: 0
  },
  padding: {
    margin: theme.spacing(2, 0)
  }
}));

/**
 * User creation validation schema.
 */
const userCreationValidation: ValidationSchema = {
  handle: {
    errorMessage: '',
    rules: [
      isRequired,
      minLength(3),
      allowedCharacters(/^[A-Za-z0-9-_]+$/),
      handleAvailable
    ]
  }
};

/**
 * Create user component.
 */
const CreateUser: React.FC<CreateUserProps> = (props: CreateUserProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const [open, setOpen] = React.useState<boolean>(false);

  // Define the base state for the user creation form.
  const [values, setValues] = React.useState({
    handle: ''
  });

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: userCreationValidation
  });

  /**
   * Handles the display for creating a new user.
   */
  const handleOverlay: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setOpen(!open);
  }

  /**
   * Handles updates to the user creation form field.
   *
   * @param { InputData } data - the field data.
   */
  const updateForm: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {

    // Reset the form errors based on field input.
    setFormErrorMessages(['']);

    // Validate the field if it has rules associated with it.
    if (validation[data.key]) {
      const properties: EventObject = {
        'form': 'create user',
        'handle': data.key === 'handle' ? data.value : values.handle,
      };

      validateField(data.key)(data.value)({
        name: `add ${data.key}`,
        properties: {...properties} 
      });
    }

    setValues({
      ...values,
      [data.key]: data.value
    });
  }

  /**
   * Submits the user creation form.
   */
  const submit: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void> = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields(
      values as Record<string, string>);

    // If we have any errors, set the messages on the form and prevent the
    // submission.
    if (errors.length > 0) {
      setFormErrorMessages(errors);
      setSubmitting(false)
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    API.requestAPI<CreateUserFormResponse>('admin/users/create', {
      body: JSON.stringify(values),
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: 'POST'
    })
    .then((response: CreateUserFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        setFormErrorMessages([response.title])
        return;
      }

      // Track the signup event.
      analytics.trackEvent('create youtube account')({
        'handle': values.handle
      });

      // Invoke the user update functions and modify the submission status.
      props.update(response.user);
      setSubmitting(false);
      setOpen(!open);

    })
    .catch(() => {
      // Present any errors that were returned in the response.
      setSubmitting(false);
      setFormErrorMessages([`Something went wrong. Please try creating the user again.`])
    });
  }

  /**
   * Displays the create new account overlay.
   */
  return (
    <React.Fragment>
      <StyledButton
        title='Create user'
        clickAction={handleOverlay}
      />
      <Modal
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
        className={clsx(classes.modal)}
        closeAfterTransition
        open={open}
        onClose={handleOverlay}
      >
        <Fade in={open}>
          <form noValidate autoComplete='off' className={clsx(classes.formContainer)}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant='h2'>
                  Create a new user
                </Typography>
              </Grid>
              <Grid item xs={12} className={clsx(classes.padding)}>
                <Input
                  handleBlur={updateForm}
                  helperText='This is the name people will know you by on ravebox. Must only contain alphanumeric characters, hyphens and underscores.'
                  name='handle'
                  type='text'
                  title="Handle" 
                  validation={validation.handle}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid
                  container
                  justify='space-between'
                >
                  <Grid item>
                    {!submitting &&
                      <StyledButton
                        title='Cancel'
                        clickAction={handleOverlay}
                        variant='outlined'
                      />
                    }
                  </Grid>
                  <Grid item>
                    <StyledButton
                      title='Create'
                      clickAction={submit}
                      submitting={submitting}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStateToProps(state: any, ownProps: CreateUserProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStateToProps
)(CreateUser);

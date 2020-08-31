/**
 * InvitationRequestForm.tsx
 * Invitation request form component to accept new requests.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  login,
} from '../../../store/user/Actions';
import { add } from '../../../store/xsrf/Actions';

// Components.
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import Input from '../../forms/input/Input';
import Link from '../../elements/link/Link';
import StyledButton from '../../elements/buttons/StyledButton';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
import { InputData } from '../../forms/input/Input.interface';
import {
  InvitationRequestFormResponse,
  InvitationRequestFormProps
} from './InvitationRequestForm.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import { isRequired, isEmail } from '../../forms/validation/ValidationRules';

/**
 * Create styles for the login form.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  fieldPadding: {
    padding: theme.spacing(1, 2)
  },
  desktopFieldPadding: {
    padding: theme.spacing(1, 2)
  }
}));

/**
 * Invitation request validation schema.
 */
const invitationRequestValidation: ValidationSchema = {
  email: {
    errorMessage: '',
    rules: [isRequired, isEmail]
  }
};

/**
 * Invitation request form component.
 */
const InvitationRequestForm: React.FC<InvitationRequestFormProps> = (props: InvitationRequestFormProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the theme for consistent styling.
  const classes = useStyles(),
        theme = useTheme(),
        desktop = useMediaQuery(theme.breakpoints.up('sm'));

  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    email: '',
    existingChannel: ''
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
    validation: invitationRequestValidation
  });

  /**
   * Handles updates to the signup form field.
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
      validateField(data.key)(data.value);
    }

    setValues({
      ...values,
      [data.key]: data.value
    });
  }

  /**
   * Submits the invitation request form.
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

    API.requestAPI<InvitationRequestFormResponse>('invitation', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    .then((response: InvitationRequestFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        setFormErrorMessages([response.title])
        return;
      }

      // Track the signup event.
      analytics.trackEvent('request invite')({
        'email': values.email,
        'existing channel': values.existingChannel
      });

      // Set the submission state.
      setSubmitting(false);

      props.history.push('/apply/success');
    });
  }

  /**
   * Displays the user login prompt.
   * @method render
   *
   * @return React.ReactNode
   */
  return (
    <form noValidate autoComplete="off">
      <Grid
        container
        direction='column'
        alignItems='stretch'
      >
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding, {
            [classes.desktopFieldPadding]: desktop
          })}
        >
          <Input
            handleBlur={updateForm}
            name='email'
            required={true}
            type='email'
            title="Email"
            validation={validation.email}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding, {
            [classes.desktopFieldPadding]: desktop
          })}
        >
          <Input
            handleBlur={updateForm}
            helperText={`If you have a social media profile that contains product reviews you've created in the past, provide a link here.`}
            name='existingChannel'
            prefix='https://'
            type='text'
            title="Link to previous reviews"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding, {
            [classes.desktopFieldPadding]: desktop
          })}
        >
          <ErrorMessages errors={formErrorMessages} />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding, {
            [classes.desktopFieldPadding]: desktop
          })}
        >
          <StyledButton
            title='Join waitlist'
            clickAction={submit}
            submitting={submitting}
          />
        </Grid>
      </Grid>
    </form>
  );
}

/**
 * Map dispatch actions to the login dialog.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      //addXsrf: add,
      //login: login
    },
    dispatch
  );

/**
 * Maps the user store properties to the login component.
 */
const mapStatetoProps = (
  state: any,
  ownProps: InvitationRequestFormProps
): InvitationRequestFormProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(InvitationRequestForm));

/**
 * SignupForm.tsx
 * Signup form component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import clsx from 'clsx';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';
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
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  login,
} from '../../../store/user/Actions';
import { add } from '../../../store/xsrf/Actions';

// Components.
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import Input from '../../forms/input/Input'; 
import LinkElement from '../../elements/link/Link';
import API from '../../../utils/api/Api.model';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { StyleType } from '../../elements/link/Link.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
import { InputData } from '../../forms/input/Input.interface';
import { SignupFormProps, SignupFormResponse } from './SignupForm.interface';
import { PrivateProfile } from '../User.interface';
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
 * Create styles for the login form.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  fieldPadding: {
    padding: theme.spacing(1, 2)
  },
}));

/**
 * Signup form validation schema.
 */
const signupValidation: ValidationSchema = {
  handle: {
    errorMessage: '',
    rules: [
      isRequired,
      minLength(3),
      allowedCharacters(/^[A-Za-z0-9-_]+$/),
      handleAvailable
    ]
  },
  email: {
    errorMessage: '',
    rules: [isRequired, isEmail]
  },
  password: {
    errorMessage: '',
    rules: [isRequired, isPassword]
  }
};

/**
 * Signup form for new accounts.
 */
const SignupForm: React.FC<SignupFormProps> = (props: SignupFormProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the theme for consistent styling.
  const classes = useStyles(),
        theme = useTheme(),
        desktop = useMediaQuery(theme.breakpoints.up('sm'));

  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    handle: '',
    email: props.invitation.email,
    invitationId: props.invitation._id,
    invitedBy: props.invitation.invitedBy,
    password: ''
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
    validation: signupValidation
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
      const properties: EventObject = {
        'form': 'sign up',
        'handle': data.key === 'handle' ? data.value : values.handle,
      };

      if (values.email) {
        properties['email'] = values.email;
      } else {
        if (data.key === 'email') {
          properties['email'] = data.value;
        }
      } 
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
   * Submits the signup form.
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

    API.requestAPI<SignupFormResponse>('user/signup', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    .then((response: SignupFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        setFormErrorMessages([response.title])
        return;
      }

      // Track the new user.
      analytics.addUser(response.user._id)({
        'handle': values.handle,
        'email': values.email
      });

      // Track the signup event.
      analytics.trackEvent('create account')({
        'handle': values.handle,
        'email': values.email
      });

      if (props.addXsrf && props.login) {
        // Retrieve the xsrf cookie to be set on the header for future requests. 
        const cookies: Cookies = new Cookies();
        const xsrf: string = cookies.get('XSRF-TOKEN');

        if (xsrf) {
          props.addXsrf(xsrf);
          props.login(response.user);
          props.history.push('/');
        }

        // Set the submission state.
        setSubmitting(false);
      }
    });
  }

  return(
    <form noValidate autoComplete="off">
      <Grid
        container
        direction='column'
        alignItems='stretch'
      >
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}
        >
          <Input
            handleBlur={updateForm}
            helperText='This is the name people will know you by on ravebox. Must only contain alphanumeric characters, hyphens and underscores.'
            name='handle'
            type='text'
            title="Handle" 
            validation={validation.handle}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}
        >
          <Input
            defaultValue={values.email}
            handleBlur={updateForm}
            name='email'
            type='email'
            title="Email" 
            validation={validation.email}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}
        >
          <Input
            handleBlur={updateForm}
            name='password'
            type='password'
            title="Password" 
            helperText='Must be at least 8 charactrs in length and include an uppercase letter, a number and a special character'
            validation={validation.password}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}
        >
          <Typography variant='subtitle1'>
            By clicking Sign Up, you are indicating that you have read and acknowledge the <LinkElement title='Terms of Service' path='/policies/terms' styleType={StyleType.STANDARD_PRIMARY} /> and <LinkElement title='Privacy policy' path='/policies/privacy-policy' styleType={StyleType.STANDARD_PRIMARY} />.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}
        >
          <ErrorMessages errors={formErrorMessages} />
        </Grid>
        <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}
        >
          <StyledButton
            title='Sign up'
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
      addXsrf: add,
      login: login
    },
    dispatch
  );

/**
 * Maps the user store properties to the signup component.
 */
const mapStatetoProps = (state: any, ownProps: SignupFormProps): SignupFormProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(SignupForm));

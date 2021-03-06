/**
 * UserLogin.tsx
 * Login component to prompt the user for login.
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
import { PrivateProfile } from '../User.interface';
import {
  LoginFormResponse, 
  LoginFormProps
} from './LoginForm.interface';
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
 * Login form validation schema.
 */
const loginValidation: ValidationSchema = {
  email: {
    errorMessage: '',
    rules: [isRequired, isEmail]
  },
  password: {
    errorMessage: '',
    rules: [isRequired]
  }
};

/**
 * Login form component.
 */
const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the theme for consistent styling.
  const classes = useStyles(),
        theme = useTheme(),
        desktop = useMediaQuery(theme.breakpoints.up('sm'));

  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    email: '',
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
    validation: loginValidation
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
   * Requests the authentication token.
   * @method getRequestToken
   */
  const authenticate: (
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

    // If we have errors, exist and trigger the error message.
    if (errors.length > 0) {
      setFormErrorMessages(errors);
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    //const instance: UserLogin = this;
    API.requestAPI<LoginFormResponse>('user/login', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    .then((response: LoginFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        setFormErrorMessages([response.title])
        return;
      }

      // Register the login event.
      analytics.trackUser(response.user._id);
      analytics.trackEvent('log in')({
        'handle': response.user.handle,
        'email': response.user.email
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
    })
    .catch(() => {
      // Present any errors that were returned in the response.
      setSubmitting(false);
      setFormErrorMessages([`Something went wrong. Please try to log in again`])
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
            allowAutocomplete={true}
            handleBlur={updateForm}
            name='email'
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
            allowAutocomplete={true}
            handleBlur={updateForm}
            name='password'
            type='password'
            title="Password" 
            validation={validation.password}
          />
          <Box style={{marginTop: 10}}>
            <Link 
              variant='subtitle2'
              color='primary'
              title='Forgot your password?'
              path='/user/reset'
            />
          </Box>
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
            title='Log in'
            clickAction={authenticate}
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
 * Maps the user store properties to the login component.
 */
const mapStatetoProps = (state: any, ownProps: LoginFormProps): LoginFormProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(LoginForm));

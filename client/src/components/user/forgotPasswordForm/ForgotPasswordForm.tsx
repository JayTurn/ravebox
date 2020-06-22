/**
 * ForgotPassword.tsx
 * ForgotPassword component to prompt the user for login.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
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

// Components.
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import Input from '../../forms/input/Input'; 
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../User.interface';
import {
  ForgotPasswordFormResponse, 
  ForgotPasswordFormProps
} from './ForgotPasswordForm.interface';
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
}));

/**
 * ForgotPassword form validation schema.
 */
const passwordResetValidation: ValidationSchema = {
  email: {
    errorMessage: '',
    rules: [isRequired, isEmail]
  }
};

/**
 * ForgotPassword form component.
 */
const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = (props: ForgotPasswordFormProps) => {

  // Define the theme for consistent styling.
  const classes = useStyles(),
        theme = useTheme(),
        desktop = useMediaQuery(theme.breakpoints.up('sm'));

  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    email: ''
  });

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  const [submitted, setSubmitted] = React.useState(false);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: passwordResetValidation
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
   * Requests the password reset token.
   * @method getRequestToken
   */
  const submitReset: (
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

    //const instance: UserForgotPassword = this;
    API.requestAPI<ForgotPasswordFormResponse>('user/password/reset', {
      method: RequestType.PATCH,
      body: JSON.stringify(values)
    })
    .then((response: ForgotPasswordFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        setFormErrorMessages([response.title])
        return;
      }
      // Set the submission state.
      setSubmitted(true);
      setSubmitting(false);
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
    <React.Fragment>
      {submitted ? (
        <Grid
          container
          direction='column'
        >
          <Grid item xs={12} md={6} className={clsx(classes.fieldPadding)}>
            <Typography variant='h3' style={{marginBottom: '1rem'}}>
              Password reset email sent
            </Typography>
            <Typography variant='body1'>
              We've sent you an email with instructions to help you reset your password.    
            </Typography>
          </Grid>
        </Grid>
      ) : (
      <form noValidate autoComplete="off">
        <Grid
          container
          direction='column'
          alignItems='stretch'
        >
          <Grid item xs={12} md={6} className={clsx(classes.fieldPadding)}>
            <Typography variant='subtitle1'>
              If you're having trouble accessing your account, enter your email address below and we'll send you instructions to reset your password
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} className={clsx(classes.fieldPadding)}>
            <Input
              handleBlur={updateForm}
              name='email'
              type='email'
              title="Email"
              validation={validation.email}
            />
          </Grid>
          <Grid item xs={12} md={6} className={clsx(classes.fieldPadding)}>
            <ErrorMessages errors={formErrorMessages} />
          </Grid>
          <Grid item xs={12} md={6} className={clsx(classes.fieldPadding)}>
            <StyledButton
              title='Send instructions'
              clickAction={submitReset}
              submitting={submitting}
            />
          </Grid>
        </Grid>
      </form>
      )}
    </React.Fragment>
  );
}

export default ForgotPasswordForm;

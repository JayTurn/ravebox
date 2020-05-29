/**
 * UserPasswordReset.tsx
 * PasswordReset component to prompt the user for login.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import Cookies from 'universal-cookie';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

// Components.
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import Input from '../../forms/input/Input'; 
import Link from '../../elements/link/Link';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../User.interface';
import {
  PasswordResetFormResponse, 
  PasswordResetFormProps
} from './PasswordResetForm.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import { isRequired, isPassword } from '../../forms/validation/ValidationRules';

/**
 * Create styles for the login form.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  fieldPadding: {
    padding: theme.spacing(1, 2)
  },
  titleContainer: {
    margin: theme.spacing(2, 0)
  }
}));

/**
 * PasswordReset form validation schema.
 */
const passwordResetValidation: ValidationSchema = {
  password: {
    errorMessage: '',
    rules: [isRequired, isPassword]
  }
};

/**
 * PasswordReset form component.
 */
const PasswordResetForm: React.FC<PasswordResetFormProps> = (props: PasswordResetFormProps) => {
  // Define the theme for consistent styling.
  const classes = useStyles(),
        theme = useTheme(),
        desktop = useMediaQuery(theme.breakpoints.up('sm'));

  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    password: '',
    token: props.token
  });

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  const [changed, setChanged] = React.useState(true);

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
   * Updates the password using the token and new password value.
   */
  const submitPassword: (
  ) => Promise<void> = async (
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

    //const instance: UserPasswordReset = this;
    API.requestAPI<PasswordResetFormResponse>('user/password/new', {
      method: RequestType.PATCH,
      body: JSON.stringify(values)
    })
    .then((response: PasswordResetFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        setFormErrorMessages([response.title])
        return;
      }
      // Set the submission state.
      setSubmitting(false);
      setChanged(true);
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
      {changed ? (
        <Grid
          container
          direction='column'
        >
          <Grid item xs={12} md={6} lg={5} className={clsx(
            classes.fieldPadding,
            classes.titleContainer
          )}>
            <Typography variant='h2' color='textPrimary'>
              Password changed successfully  
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}>
            <Typography variant='body1'>
              You may now <Link path='/user/login' title='log in' /> with your new password.  
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <form noValidate autoComplete="off">
          <Grid
            container
            direction='column'
          >
            <Grid item xs={12} md={6} lg={5} className={clsx(
              classes.fieldPadding,
              classes.titleContainer
            )}>
              <Typography variant='h2' color='textPrimary'>
                Create a new password  
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}>
              <Typography variant='subtitle1'>
                Enter a new password and we'll update your account
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}>
              <Input
                handleBlur={updateForm}
                name='password'
                type='password'
                title="New password"
                validation={validation.password}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}>
              <ErrorMessages errors={formErrorMessages} />
            </Grid>
            <Grid item xs={12} md={6} lg={5} className={clsx(classes.fieldPadding)}>
              <StyledButton
                title='Change password'
                clickAction={submitPassword}
                submitting={submitting}
              />
            </Grid>
          </Grid>
        </form>
      )}
    </React.Fragment>
  );
}

export default PasswordResetForm;

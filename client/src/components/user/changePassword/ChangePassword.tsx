/**
 * ChangePassword.tsx
 * Component to support user's changing their email addres.
 */

// Modules.
import * as React from 'react';
import API from '../../../utils/api/Api.model';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { VariantType, useSnackbar } from 'notistack';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import Input from '../../forms/input/Input';
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import StyledButton from '../../elements/buttons/StyledButton';

// Interfaces.
import {
  ChangePasswordProps,
  ChangePasswordResponse,
  PasswordSettings,
  VerifyPasswordResponse
} from './ChangePassword.interface';
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../User.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Validation rules.
import {
  isRequired,
  isPassword,
} from '../../forms/validation/ValidationRules';

/**
 * Password validation schema.
 */
const passwordValidation: ValidationSchema = {
  password: {
    errorMessage: '',
    rules: [isRequired, isPassword]
  }
};

/**
 * Renders the form for a user to change their email.
 *
 * @param { ChangePasswordProps } props - the component properties.
 *
 * @return JSXElement
 */
const ChangePassword: React.FC<ChangePasswordProps> = (props: ChangePasswordProps) => {
  // Register the theme and snackbar providers.
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

  // Define the settings to be updated upon save.
  //const [settings, updateSettings] = React.useState<PrivateProfile>({_id: '', email: '', emailVerified: false, handle: ''});

  // Define the password settings.
  const [settings, updateSettings] = React.useState<PasswordSettings>({
    allowed: false,
    oldPassword: '',
    password: ''
  });

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Define the state for checking if values have changed.
  const [changed, setChanged] = React.useState<boolean>(false);

  const [passwordUpdated, setPasswordUpdated] = React.useState<boolean>(false);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: passwordValidation
  });

  /**
   * Handles updates to the profile form.
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

    const updatedSettings: PasswordSettings = {
      ...settings,
      [data.key]: data.value
    };

    if (props.profile) {
      const updatedSettingsString: string = JSON.stringify(updatedSettings),
            settingsString: string = JSON.stringify(settings);

      if (settingsString === updatedSettingsString) {
        setChanged(false);
        return;
      } else {
        setChanged(true);
      }
    }

    // Validate the field if it has rules associated with it.
    if (validation[data.key]) {
      validateField(data.key)(data.value);
    }

    updateSettings({
      ...settings,
      [data.key]: data.value
    });
  }

  /**
   * When focusing on the field.
   */
  const handleFocus: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    setChanged(true);
  }

  /**
   * Verifies the current password for the user.
   */
  const verifyPassword: () => void = (): void => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    setPasswordUpdated(false);

    API.requestAPI<VerifyPasswordResponse>('user/password/verify', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.PATCH,
      body: JSON.stringify({
        password: settings.oldPassword
      })
    })
    .then((response: VerifyPasswordResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])
        setSubmitting(false);
        return;
      }

      if (response.verified) {
        updateSettings({
          ...settings,
          allowed: true,
        });
      } else {
        setFormErrorMessages(['The password you entered could not be verified'])
      }

      // Set the submission state.
      setSubmitting(false);

    })
    .catch((error: Error) => {
      console.log(error);
      // Set the submission state.
      setSubmitting(false);
    });
  }

  /**
   * Performs the password update.
   */
  const updatePassword: (
  ) => Promise<void> = async (
  ): Promise<void> => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields({
      password: settings.password
    });

    // If we have any errors, set the messages on the form and prevent the
    // submission.
    if (errors.length > 0) {
      setFormErrorMessages(errors);
      setSubmitting(false)
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    API.requestAPI<ChangePasswordResponse>('user/update/password', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.PATCH,
      body: JSON.stringify({
        oldPassword: settings.oldPassword,
        password: settings.password
      })
    })
    .then((response: ChangePasswordResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])
        setSubmitting(false);
        return;
      }

      if (props.update) {
        updateSettings({
          allowed: false,
          oldPassword: '',
          password: ''
        });
        props.update(response.user);
      }

      // Set the submission state.
      setSubmitting(false);

      setPasswordUpdated(true); 

      // Display the success message to the user.
      enqueueSnackbar('Handle updated successfully', { variant: 'success' });
    })
    .catch((error: Error) => {
      console.log(error);
      // Set the submission state.
      setSubmitting(false);
    });
  }

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} md={6} style={{marginBottom: 40}}>
        <Typography variant='h2' color='textPrimary'>Security</Typography>
        <Typography variant='subtitle1' color='textPrimary'>Protecting your account</Typography>
        <PaddedDivider style={{marginBottom: 20}}/>
        {props.profile &&
          <React.Fragment>
            <Grid item xs={12} style={{marginBottom: 20}}>
              <Typography variant='subtitle1' style={{marginBottom: 20}}>
                To change your password, begin by verifying your current password
              </Typography>
              <Input
                defaultValue={settings.oldPassword}
                handleChange={updateForm}
                handleFocus={handleFocus}
                name='oldPassword'
                type='password'
                title="Current password"
              />
            </Grid>
            {settings.allowed ? (
              <React.Fragment>
                <Typography variant='subtitle1' color='textPrimary' style={{marginBottom: '1rem'}}>
                  Password verification <Box component='span' style={{fontWeight: 900, color: theme.palette.success.main}}>successful</Box>, enter your new password below
                </Typography>
                <Input
                  defaultValue={settings.password}
                  handleChange={updateForm}
                  handleFocus={handleFocus}
                  name='password'
                  type='password'
                  title="New password"
                  validation={validation.password}
                />
                <ErrorMessages errors={formErrorMessages} />
                <Box style={{marginTop: 20, marginBottom: 40}}>
                  <StyledButton
                    disabled={!changed}
                    title='Change password'
                    clickAction={updatePassword}
                    submitting={submitting}
                  />
                </Box>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {passwordUpdated &&
                  <Box style={{marginBottom: '1rem'}}>
                    <Typography variant='subtitle1'>
                      <Box component='span' style={{fontWeight: 900, color: theme.palette.success.main}}>Password changed.</Box> Your new password is active immediately.
                    </Typography>
                  </Box>
                }
                <ErrorMessages errors={formErrorMessages} />
                <Grid item xs={12}>
                  <StyledButton
                    disabled={!changed}
                    title='Verify'
                    clickAction={verifyPassword}
                    submitting={submitting}
                  />
                </Grid>
              </React.Fragment>
            )}
          </React.Fragment>
        }
      </Grid>
    </Grid>
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
      update: update
    },
    dispatch
  );

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: ChangePasswordProps) {
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
  mapStatetoProps,
  mapDispatchToProps
)(ChangePassword);

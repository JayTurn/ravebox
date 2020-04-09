/**
 * ChangeEmail.tsx
 * Component to support user's changing their email addres.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { useTheme } from '@material-ui/core/styles';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import Input from '../../forms/input/Input';
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import StyledButton from '../../elements/buttons/StyledButton';

// Interfaces.
import { ChangeEmailProps, ChangeEmailResponse } from './ChangeEmail.interface';
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
  isEmail,
} from '../../forms/validation/ValidationRules';

/**
 * Contact validation schema.
 */
const contactValidation: ValidationSchema = {
  handle: {
    errorMessage: '',
    rules: [
      isRequired,
      isEmail
    ]
  }
};

/**
 * Renders the form for a user to change their email.
 *
 * @param { ChangeEmailProps } props - the component properties.
 *
 * @return JSXElement
 */
const ChangeEmail: React.FC<ChangeEmailProps> = (props: ChangeEmailProps) => {
  const theme = useTheme();

  // Define the settings to be updated upon save.
  const [settings, updateSettings] = React.useState<PrivateProfile>({_id: '', email: '', emailVerified: false, handle: ''});

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Define the state for checking if values have changed.
  const [changed, setChanged] = React.useState<boolean>(false);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: contactValidation
  });

  /**
   * Updates the settings state based on changes to the user profile.
   */
  React.useEffect(() => {
    if (!settings._id && props.profile) {
      updateSettings({...props.profile});
    }
  }, [props.profile, settings, updateSettings]);

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

    const updatedSettings: PrivateProfile = {
      ...settings,
      [data.key]: data.value
    };

    if (props.profile) {
      const settingsString: string = JSON.stringify(updatedSettings),
            profileString: string = JSON.stringify(props.profile);

      if (settingsString === profileString) {
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
   * Performs the contact settings update.
   */
  const submitContact: (
  ) => Promise<void> = async (
  ): Promise<void> => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields({
      email: settings.email
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

    API.requestAPI<ChangeEmailResponse>('user/update/email', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.PATCH,
      body: JSON.stringify({email: settings.email})
    })
    .then((response: ChangeEmailResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])
        setSubmitting(false);
        return;
      }

      if (props.update) {
        props.update(response.user);
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

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} md={6} style={{marginBottom: 40}}>
        <Typography variant='h2' color='textPrimary'>Contact details</Typography>
        <Typography variant='subtitle1' color='textPrimary'>Where we send important information for your account</Typography>
        <PaddedDivider />
        {props.profile && settings._id &&
          <Input
            defaultValue={props.profile.email}
            handleChange={updateForm}
            name='email'
            type='email'
            title="Email" 
            validation={validation.email}
          />
        }
        <Box style={{marginTop: 20, marginBottom: 40}}>
          {props.profile && props.profile.emailVerified ? (
            <Typography variant='subtitle1'>
              <Box component='span' style={{fontWeight: 900, color: theme.palette.success.main}}>Verified.</Box> Thank you for verifying your email address.
            </Typography>
          ) : (
            <Typography variant='subtitle1'>
              <Box component='span' style={{fontWeight: 700, color: theme.palette.error.main}}>Not verified.</Box> Please verify your email so you can enjoy all of our great features.
            </Typography>
          )}
        </Box>
        <Box style={{marginTop: 20, marginBottom: 40}}>
          <StyledButton
            disabled={!changed}
            title='Save email'
            clickAction={submitContact}
            submitting={submitting}
          />
        </Box>
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
function mapStatetoProps(state: any, ownProps: ChangeEmailProps) {
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
)(ChangeEmail);

/**
 * ChangeProfile.tsx
 * Component to support user's changing their profile details.
 */

// Modules.
import * as React from 'react';
import API from '../../../utils/api/Api.model';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Box from '@material-ui/core/Box';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { VariantType, useSnackbar } from 'notistack';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import Input from '../../forms/input/Input';
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  ChangeProfileProps,
  ChangeProfileResponse
} from './ChangeProfile.interface';
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../User.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  allowedCharacters,
  isRequired,
  handleAvailable,
  minLength
} from '../../forms/validation/ValidationRules';

/**
 * Profile validation schema.
 */
const profileValidation: ValidationSchema = {
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
 * Renders the form for a user to change their email.
 */
const ChangeProfile: React.FC<ChangeProfileProps> = (props: ChangeProfileProps) => {
  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Define the settings to be updated upon save.
  const [settings, updateSettings] = React.useState<PrivateProfile>({
    _id: '',
    email: '',
    emailVerified: false,
    following: {
      channels: []
    },
    handle: ''
  });

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
    validation: profileValidation
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
   * Performs the settings update.
   */
  const submitProfile: (
  ) => Promise<void> = async (
  ): Promise<void> => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields({
      handle: settings.handle
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

    API.requestAPI<ChangeProfileResponse>('user/update/profile', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.PATCH,
      body: JSON.stringify({handle: settings.handle})
    })
    .then((response: ChangeProfileResponse) => {
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
        <Typography variant='h2' color='textPrimary'>Profile</Typography>
        <Typography variant='subtitle1' color='textPrimary'>Change information others can see on your profile</Typography>
        <PaddedDivider />
        {props.profile && settings._id &&
          <Input
            defaultValue={props.profile.handle}
            handleBlur={updateForm}
            helperText='This is the name people will know you by on ravebox. It may only contain alphanumeric characters, hyphens and underscores.'
            handleFocus={handleFocus}
            name='handle'
            type='text'
            title="Handle"
            validation={validation.handle}
          />
        }
        <Box style={{marginTop: 20, marginBottom: 40}}>
          <StyledButton
            disabled={!changed}
            title='Save handle'
            clickAction={submitProfile}
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
function mapStatetoProps(state: any, ownProps: ChangeProfileProps) {
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
)(ChangeProfile);

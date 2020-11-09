/**
 * ChangeProfile.tsx
 * Component to support user's changing their profile details.
 */

// Modules.
import * as React from 'react';
import API from '../../../utils/api/Api.model';
import Avatar from '@material-ui/core/Avatar';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { VariantType, useSnackbar } from 'notistack';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import ImageUpload from '../../forms/imageUpload/ImageUpload';
import Input from '../../forms/input/Input';
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import StyledButton from '../../elements/buttons/StyledButton';
import UpdateProfileLinks from '../updateProfileLinks/UpdateProfileLinks';

// Enumerators.
import { ImageUploadPaths } from '../../forms/imageUpload/ImageUpload.enum';
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  ChangeProfileProps,
  ChangeProfileResponse
} from './ChangeProfile.interface';
import { InputData } from '../../forms/input/Input.interface';
import {
  PrivateProfile,
  UserLink
} from '../User.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  allowedCharacters,
  isRequired,
  handleAvailable,
  minLength
} from '../../forms/validation/ValidationRules';

// Define the styles to be used for the drop zone.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(8),
      width: theme.spacing(8)
    },
    avatarIcon: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.grey.A700,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(8),
      width: theme.spacing(8)
    },
    avatarWrapper: {
      position: 'relative'
    },
    avatarButtonColumn: {
      marginTop: theme.spacing(2)
    },
    avatarButtonRow: {
      marginLeft: theme.spacing(2)
    },
    loadingAvatar: {
      position: 'absolute',
      top: theme.spacing(-0.5),
      left: theme.spacing(-0.5),
    },
  })
);

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

  // Styles for the zone.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Define the settings to be updated upon save.
  const [settings, updateSettings] = React.useState<PrivateProfile>({
    _id: '',
    about: '',
    avatar: '',
    email: '',
    emailVerified: false,
    following: {
      channels: []
    },
    handle: '',
    links: [],
    role: []
  });

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Define the state for checking if values have changed.
  const [changed, setChanged] = React.useState<boolean>(false);

  // Define the profile image.
  const [profileImage, setProfileImage] = React.useState(new File([''], ''));

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  const [updatingAvatar, setUpdatingAvatar] = React.useState<boolean>(false);

  // Retrieve the user's first letter of their name.
  const firstLetter: string = props.profile ? props.profile.handle.substr(0,1) : 'R';

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
   * Updates the profile image and submits the updated profile.
   *
   * @param { string } path - the path to the user's avatar.
   */
  const updateAvatar: (
    path: string
  ) => void = (
    path: string
  ): void => {
    updateSettings({
      ...settings,
      avatar: path
    });
    setUpdatingAvatar(true);
    submitProfile(path);
  }

  /**
   * Updates the profile links and submits the updated profile.
   *
   * @param { Array<UserLink> } links - the users profile links.
   */
  const updateLinks: (
    links: Array<UserLink>
  ) => void = (
    links: Array<UserLink>
  ): void => {
    const updatedSettings: PrivateProfile = {...settings};
    updatedSettings.links = [...links];
    updateSettings(updatedSettings);
  }

  const handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
  ): void => {
    submitProfile();
  }

  /**
   * Performs the settings update.
   */
  const submitProfile: (
    updatedAvatar?: string
  ) => Promise<void> = async (
    updatedAvatar?: string
  ): Promise<void> => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    if (props.profile && settings.handle !== props.profile.handle) {
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
    }

    // Set the submission state.
    if (!updatedAvatar) {
      setSubmitting(true)
    }

    API.requestAPI<ChangeProfileResponse>('user/update/profile', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.PATCH,
      body: JSON.stringify({
        about: settings.about,
        avatar: updatedAvatar ? updatedAvatar : props.profile ? props.profile.avatar : '',
        handle: settings.handle,
        links: settings.links
      })
    })
    .then((response: ChangeProfileResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])
        setSubmitting(false);
        return;
      }

      setTimeout(() => {

        if (props.update) {
          props.update(response.user);
        }

        setUpdatingAvatar(false);

        // Set the submission state.
        setSubmitting(false);

        // Display the success message to the user.
        enqueueSnackbar('Profile updated successfully', { variant: 'success' });

      }, updatedAvatar ? 5000 : 0);

    })
    .catch((error: Error) => {
      console.log(error);
      // Set the submission state.
      setSubmitting(false);
      setUpdatingAvatar(false);
    });
  }

  return (
    <Grid
      container
      direction='column'
    >
      {props.profile && settings._id &&
        <React.Fragment>
          <Grid item xs={12} md={6} style={{marginBottom: 40}}>
            <Grid
              container
              direction={largeScreen ? 'row' : 'column'}
              alignItems='center'
            >
              <Grid item>
                <Box className={clsx(classes.avatarWrapper)}>
                  {props.profile.avatar ? (
                    <Avatar
                      alt={props.profile.handle}
                      className={clsx(
                        classes.avatar
                      )}
                      src={props.profile.avatar}
                    />
                  ): (
                    <Avatar
                      alt={props.profile.handle}
                      className={classes.avatarIcon}
                    >{firstLetter}</Avatar>
                  )}
                  {updatingAvatar && 
                    <CircularProgress
                      size={theme.spacing(9)}
                      className={clsx(classes.loadingAvatar)}
                      color='secondary'
                    />
                  }
                </Box>
              </Grid>
              <Grid item className={clsx({
                [classes.avatarButtonColumn]: !largeScreen,
                [classes.avatarButtonRow]: largeScreen
              })}>
                <ImageUpload
                  id={props.profile._id}
                  buttonTitle='Change profile photo'
                  circleCrop={true}
                  maxFileSize={0.1}
                  path={props.profile.avatar || ''} 
                  requestPath={ImageUploadPaths.AVATAR}
                  update={updateAvatar} 
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} style={{marginBottom: 40}}>
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
            <Box style={{marginTop: 20, marginBottom: 40}}>
              <StyledButton
                disabled={!changed}
                title='Save handle'
                clickAction={handleSubmit}
                submitting={submitting}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} style={{marginBottom: 40}}>
            <Input
              defaultValue={props.profile.about}
              handleBlur={updateForm}
              helperText='Enter some information to help people get to know you.'
              handleFocus={handleFocus}
              multiline
              name='about'
              rows={4}
              rowsMax={10}
              type='text'
              title="About"
            />
            <Box style={{marginTop: 20, marginBottom: 40}}>
              <StyledButton
                disabled={!changed}
                title='Save about'
                clickAction={handleSubmit}
                submitting={submitting}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6} style={{marginBottom: 40}}>
            <UpdateProfileLinks
              update={updateLinks}
              links={props.profile.links || []}
              submit={submitProfile}
            />
          </Grid>
        </React.Fragment>
      }
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

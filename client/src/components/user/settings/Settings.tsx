/**
 * Settings.tsx
 * User account settings component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import ChangeEmail from '../changeEmail/ChangeEmail';
import ChangeProfile from '../changeProfile/ChangeProfile';
import Input from '../../forms/input/Input'; 
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Hooks.
import { useUpdateSettings } from './useUpdateSettings.hook';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../User.interface';
import { SettingsProps } from './Settings.interface';
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
 * Settings validation schema.
 */
const settingsValidation: ValidationSchema = {
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
 * Renders profile settings for authenticated users.
 */
const Settings: React.FC<SettingsProps> = (props: SettingsProps) => {

  // Retrieve the user profile and define the settings to be updated.
  const {
    profileStatus,
  } = useUpdateSettings({
    profile: props.profile,
    updateProfile: props.update
  });

  return (
    <React.Fragment>
      {profileStatus === RetrievalStatus.SUCCESS &&
        <form noValidate autoComplete="off">
          {props.profile && props.update &&
            <Grid container direction='column'>
              <ChangeProfile profile={props.profile} update={props.update} />
              <Grid item xs={12} md={6}>
                <Typography variant='h2'color='textPrimary'>Contact details</Typography>
                <PaddedDivider />
                <ChangeEmail
                  email={props.profile.email}
                  emailVerified={props.profile.emailVerified}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='h2' color='textPrimary'>Security</Typography>
                <PaddedDivider />
              </Grid>
            </Grid>
          }
        </form>
      }
    </React.Fragment>
  );
};

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
function mapStatetoProps(state: any, ownProps: SettingsProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile
  };
}

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(Settings);

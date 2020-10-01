/**
 * ContactSettings.tsx
 * User contact settings component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  update,
} from '../../../../store/user/Actions';

// Components.
import ChangeEmail from '../../changeEmail/ChangeEmail';

// Enumerators.
import { RetrievalStatus } from '../../../../utils/api/Api.enum';

// Hooks.
import { useUpdateSettings } from '../useUpdateSettings.hook';

// Interfaces.
import { PrivateProfile } from '../../User.interface';
import { ContactSettingsProps } from './ContactSettings.interface';

/**
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  descriptionText: {
    marginBottom: theme.spacing(4)
  }
}));

/**
 * Renders contact settings for authenticated users.
 */
const ContactSettings: React.FC<ContactSettingsProps> = (props: ContactSettingsProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        mobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Retrieve the user profile and define the settings to be updated.
  const {
    profileStatus,
  } = useUpdateSettings({
    admin: false,
    profile: props.profile,
    updateProfile: props.update
  });

  return (
    <React.Fragment>
      {profileStatus === RetrievalStatus.SUCCESS &&
        <Fade in={true}>
          <form noValidate autoComplete="off">
            {props.profile && props.update &&
              <Grid container direction='column' style={{padding: theme.spacing(0, 2)}}>
                <Typography
                  className={clsx(classes.descriptionText)}
                  color='textPrimary'
                  variant='h3'
                >
                  Where we send important information for your account
                </Typography>
                <ChangeEmail />
              </Grid>
            }
          </form>
        </Fade>
      }
    </React.Fragment>
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
function mapStatetoProps(state: any, ownProps: ContactSettingsProps) {
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
)(ContactSettings);

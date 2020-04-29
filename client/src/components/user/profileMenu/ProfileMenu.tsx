/**
 * ProfileMenu.tsx
 * Menu for signed in users.
 */

// Modules.
import * as React from 'react';
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router';

// Actions.
import { remove } from '../../../store/xsrf/Actions';
import { logout } from '../../../store/user/Actions';

// Interfaces.
import { PrivateProfile } from '../User.interface';
import { ProfileMenuProps } from './ProfileMenu.interface';

/**
 * Profile icon button.
 */
const ProfileIconButton = withStyles((theme: Theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'rgba(203,205,255, 0.2)' 
    }
  },
}))(IconButton);

/**
 * Mobile profile icon button.
 */
const MobileProfileIconButton = withStyles((theme: Theme) => ({
  root: {
    padding: '6px',
    marginRight: '6px',
    '&:hover': {
      backgroundColor: 'rgba(203,205,255, 0.2)' 
    }
  },
}))(IconButton);

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    minWidth: '200px'
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

/**
 * Renders profile options for authenticated users.
 */
const ProfileMenu: React.FC<ProfileMenuProps> = (props: ProfileMenuProps) => {
  // Define the menu anchor.
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const theme = useTheme();

  // Match the large media query size.
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  /**
   * Handles the opening of the profile menu.
   */
  const handleClick: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (e.currentTarget) {
      setAnchorEl(e.currentTarget);
    }
  }

  /**
   * Handles the closing of the profile menu.
   */
  const handleClose: () => void = (): void => {
    setAnchorEl(null);
  }

  /**
   * Handles the logout.
   * @method handleLogin
   */
  const handleLogout: (
  ) => void = (
  ): void => {

    // Remove the cookies from the application.
    const cookies: Cookies = new Cookies();
    cookies.remove('XSRF-TOKEN');

    if (props.removeXsrf) {
      // Remove the tokens and user from the redux store.
      props.removeXsrf('');
    }

    if (props.profile && props.logout) {
      props.logout(props.profile);
    }

    // Redirect to the home screen.
    props.history.push('/');
  }

  /**
   * Handles the navigation to the user's reviews.
   */
  const reviews: () => void = (): void => {

    // Close the menu.
    handleClose();

    // Redirect to the home screen.
    props.history.push('/user/reviews');
  }

  /**
   * Handles the navigation to the different locations.
   */
  const settings: () => void = (): void => {

    // Close the menu.
    handleClose();

    // Redirect to the home screen.
    props.history.push('/account');
  }
  
  return (
    <React.Fragment>
      {largeScreen ? (
        <ProfileIconButton onClick={handleClick}>
          <AccountCircleSharpIcon color='primary' fontSize='large'/>
        </ProfileIconButton>
      ) : (
        <MobileProfileIconButton onClick={handleClick}>
          <AccountCircleSharpIcon color='primary' style={{fontSize: '1.7rem', marginTop: '4px'}}/>
        </MobileProfileIconButton>
      )}
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={reviews}>
          <Typography color='textPrimary' variant="inherit">
            My raves
          </Typography>
        </MenuItem>
        <MenuItem onClick={settings}>
          <Typography color='textPrimary' variant="inherit">
            Settings
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon color='textPrimary' style={{minWidth: '30px'}}>
            <ExitToAppIcon />
          </ListItemIcon>
          <Typography color='textPrimary' variant="inherit">
            Log out
          </Typography>
        </MenuItem>
      </StyledMenu>
    </React.Fragment>
  );
}

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: ProfileMenuProps) {

  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile
  };

}

/**
 * Map dispatch actions to the navigation route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      logout: logout,
      removeXsrf: remove
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(ProfileMenu)
);

/**
 * TopNavigation.tsx
 * TopNavigation menu component.
 */

// Modules.
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { createStyles, styled, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Cookies from 'universal-cookie';

// Actions.
import { logout } from '../../../store/user/Actions';
import { remove } from '../../../store/xsrf/Actions';
import { toggleSide } from '../../../store/navigation/Actions';

// Components.
import Logo from '../../logo/Logo';
import ProfileMenu from '../../user/profileMenu/ProfileMenu';

// Interfaces.
import { TopNavigationProps } from './TopNavigation.interface';
import { PrivateProfile } from '../../user/User.interface';

// Make the app specific styles.
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: { },
  linksNoHover: {
    textDecoration: 'none'
  },
  links: {
    textDecoration: 'none',
    color: theme.palette.grey.A700,
    '&.active': {
      color: theme.palette.primary.dark
    },
    '&:hover': {
      color: theme.palette.primary.main
    }
  },
  linksInverse: {
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
    '&.active': {
      color: theme.palette.primary.contrastText,
    }
  }
}));

const StyledAppBar = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    borderBottom: `2px solid ${theme.palette.primary.light}`,
    zIndex: theme.zIndex.drawer + 1
  }
  }))(AppBar);

const MenuIconButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'rgba(203,205,255, 0.2)'
    }
  }
}))(IconButton);

const LogoButton = withStyles((theme: Theme) => ({
  root: {
    fontSize: '.9rem',
    '&:hover': {
      backgroundColor: 'transparent' 
    },
    marginRight: 10
  }
}))(Button);

const MenuButton = withStyles((theme: Theme) => ({
  root: {
    fontSize: '.9rem',
    '&:hover': {
      backgroundColor: 'rgba(203,205,255, 0.2)' 
    },
    marginRight: 10
  }
}))(Button);

const MenuButtonContained = withStyles({
  root: {
    fontSize: '.9rem'
  }
})(Button);

/**
 * Component to manage the main navigation of the application.
 */
const TopNavigation: React.FC<TopNavigationProps> = (props: TopNavigationProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();


  // Match the small media query size.
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const toggleSideNavigation: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    e.preventDefault();

    if (typeof props.sideMenuExpanded !== 'undefined') {
      if (props.toggleSide) {
        props.toggleSide(!props.sideMenuExpanded);
      }
    }
  }

  /**
   * Renders the navigation menu.
   */
  return (
    <StyledAppBar position='sticky' color='inherit'>
      <Toolbar disableGutters={true}>
        {largeScreen ? (
          <React.Fragment>
            <MenuIconButton
              style={{marginLeft: 12, marginRight: 20}}
              onClick={toggleSideNavigation}
            >
              <MenuIcon />
            </MenuIconButton>
            <LogoButton
              color='inherit'
              disableElevation={true}
              style={{paddingTop: '5px'}}
            >
              <NavLink to="/" exact activeClassName='active'>
                <Logo iconOnly={false} fullWidth='130px'/>
              </NavLink>
            </LogoButton>
          </React.Fragment>
        ): (
          <React.Fragment>
            <MenuIconButton
              style={{marginTop: '5px'}}
              onClick={toggleSideNavigation}
            >
              <MenuIcon />
            </MenuIconButton>
            <LogoButton
              color='inherit'
              disableElevation={true}
            >
              <NavLink to="/" exact activeClassName='active'>
                <Logo iconOnly={true} fullWidth='44px'/>
              </NavLink>
            </LogoButton>
          </React.Fragment>
        )}
        {props.profile ? (
          <React.Fragment>
            <div style={{flexGrow: 1}} />
            <ProfileMenu />  
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div style={{flexGrow: 1}} />
            <MenuButton color="inherit">
              <NavLink to="/user/login" activeClassName="active" className={classes.links}>Log in</NavLink>
            </MenuButton>
            <MenuButtonContained color="primary" variant='contained' disableElevation>
              <NavLink to="/user/signup" activeClassName="active" className={classes.linksInverse}>Sign up</NavLink>
            </MenuButtonContained>
          </React.Fragment>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: TopNavigationProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  const sideMenuExpanded: boolean | undefined = state.navigation ? state.navigation.display : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile,
    sideMenuExpanded
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
      removeXsrf: remove,
      toggleSide: toggleSide
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(TopNavigation)
);

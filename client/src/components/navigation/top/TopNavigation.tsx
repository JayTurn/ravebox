/**
 * TopNavigation.tsx
 * TopNavigation menu component.
 */

// Modules.
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp';
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { withRouter } from 'react-router';

// Actions.
import { logout } from '../../../store/user/Actions';
import { remove } from '../../../store/xsrf/Actions';
import { toggleSide } from '../../../store/navigation/Actions';

// Components.
import Logo from '../../logo/Logo';
import ProfileMenu from '../../user/profileMenu/ProfileMenu';

// Interfaces.
import {
  NavigationScrollProps,
  TopNavigationProps
} from './TopNavigation.interface';
import { PrivateProfile } from '../../user/User.interface';

// Make the app specific styles.
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: { },
  lastButton: {
    marginRight: theme.spacing(1)
  },
  linkButton: {
    fontSize: '0.75rem',
    paddingBottom: '5px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: '5px'
  },
  linkButtonLarge: {
    fontSize: '0.9rem',
    padding: theme.spacing(1, 2)
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
  linksNoHover: {
    textDecoration: 'none'
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

const StyledMobileAppBar = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.common.white,
    boxShadow: 'none',
    borderBottom: `2px solid ${theme.palette.primary.light}`,
    zIndex: theme.zIndex.drawer + 1,
    top: 0
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

/**
 * Menu button icon.
 */
const MenuButton = withStyles((theme: Theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'rgba(203,205,255, 0.2)'
    },
    marginRight: 10
  }
}))(Button);

/**
 * Hides the navigation menu on scroll.
 */
const HideOnScroll: React.FC<NavigationScrollProps> = (props: NavigationScrollProps) => {
  // Capture the scroll trigger.
  const { children } = props;
  const trigger = useScrollTrigger();

  // Slide the display of the child elements based on the scroll trigger.
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

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
    <React.Fragment>
      {largeScreen ? (
        <StyledAppBar position='sticky' color='inherit'>
          <Toolbar disableGutters={true}>
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
            {props.profile ? (
              <React.Fragment>
                <div style={{flexGrow: 1}} />
                <ProfileMenu />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{flexGrow: 1}} />
                <MenuButton
                  className={clsx(classes.linkButtonLarge)}
                  color="inherit"
                >
                  <NavLink to="/user/login" activeClassName="active" className={classes.links}>Log in</NavLink>
                </MenuButton>
                <Button
                  className={clsx(classes.linkButtonLarge, classes.lastButton)}
                  color="primary"
                  disableElevation
                  variant='contained'
                >
                  <NavLink to="/user/signup" activeClassName="active" className={classes.linksInverse}>Sign up</NavLink>
                </Button>
              </React.Fragment>
            )}
          </Toolbar>
        </StyledAppBar>
      ) : (
        <HideOnScroll>
          <StyledMobileAppBar position='sticky' color='inherit'>
            <Toolbar disableGutters={true} style={{minHeight: '50px'}}>
              <MenuIconButton
                style={{marginLeft: '6px', marginTop: '4px', padding: '6px 6px 6px'}}
                onClick={toggleSideNavigation}
              >
                <MenuIcon />
              </MenuIconButton>
              <LogoButton
                color='inherit'
                disableElevation={true}
              >
                <NavLink to="/" exact activeClassName='active'>
                  <Logo iconOnly={true} fullWidth='30px'/>
                </NavLink>
              </LogoButton>
              {props.profile ? (
                <React.Fragment>
                  <div style={{flexGrow: 1}} />
                  <ProfileMenu />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{flexGrow: 1}} />
                  <MenuButton
                    color="inherit"
                    className={clsx(classes.linkButton)}
                  >
                    <NavLink to="/user/login" activeClassName="active" className={classes.links}>Log in</NavLink>
                  </MenuButton>
                  <Button
                    className={clsx(classes.linkButton, classes.lastButton)}
                    color="primary"
                    disableElevation
                    variant='contained'
                  >
                    <NavLink to="/user/signup" activeClassName="active" className={classes.linksInverse}>Sign up</NavLink>
                  </Button>
                </React.Fragment>
              )}
            </Toolbar>
          </StyledMobileAppBar>
        </HideOnScroll>
      )}
    </React.Fragment>
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

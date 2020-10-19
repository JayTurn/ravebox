/**
 * StreamNavigation.tsx
 * StreamNavigation menu component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
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
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink, useLocation } from 'react-router-dom';
import * as React from 'react';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
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
import SearchField from '../../search/field/SearchField';
import ImpersonateUser from '../../admin/impersonateUser/ImpersonateUser';

// Interfaces.
import {
  StreamNavigationScrollProps,
  StreamNavigationProps
} from './StreamNavigation.interface';
import { PrivateProfile } from '../../user/User.interface';

// Make the app specific styles.
const useStyles = makeStyles((theme: Theme) => createStyles({
  root: { },
  lastButton: {
    marginRight: 0
  },
  linkButton: {
    fontSize: '0.75rem',
    paddingBottom: '3px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: '5px'
  },
  linkButtonLarge: {
    fontSize: '0.8rem',
    marginTop: 13,
    padding: theme.spacing(.5, 1)
  },
  links: {
    color: theme.palette.common.white,
    fontWeight: 700,
    textDecoration: 'none',
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
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
    '&.active': {
      color: theme.palette.primary.contrastText,
    }
  },
  menuIconBadge: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
    height: 17,
    width: 18
  },
  menuIconBadgeContainer: {
    bottom: 4,
    position: 'absolute',
    right: 10 
  },
  searchButton: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 16,
    flexWrap: 'nowrap',
    padding: theme.spacing(0, 0.5)
  },
  searchContainer: {
    flexShrink: 1
  },
  searchIcon: {
    color: theme.palette.common.white,
    height: 16,
    marginTop: 6,
    width: 18
  },
  searchIconContainer: {
    marginRight: theme.spacing(.5)
  },
  searchText: {
    color: theme.palette.common.white,
    fontSize: '.8rem',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  searchTextContainer: {
    flexShrink: 1,
    overflow: 'hidden'
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.common.white}`,
    flexWrap: 'nowrap',
    margin: theme.spacing(0, 1),
    maxWidth: 'calc(100vw - 16px)',
    minHeight: 52
  }
}));

const LogoIconButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: 'transparent'
    },
    marginLeft: 0,
    padding: theme.spacing(.5)
  },
}))(IconButton);

/**
 * Menu button icon.
 */
const MenuButton = withStyles((theme: Theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'rgba(203,205,255, 0.2)'
    }
  }
}))(Button);

/**
 * Component to manage the stream navigation of the application.
 */
const StreamNavigation: React.FC<StreamNavigationProps> = (props: StreamNavigationProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        path = useLocation();

  const cookie: Cookies = new Cookies(),
        adminCookie: string = cookie.get('XSRF-TOKEN-ADMIN');

  // Create a search bar state.
  const [searchBar, setSearchBar] = React.useState<boolean>(false);

  const [profileId, setProfileId] = React.useState<string>('');

  // If we have an admin cookie, we'll need to display the button to stop
  // impersontating a user.
  const [isAdmin, setIsAdmin] = React.useState<boolean>(adminCookie !== undefined);

  /**
   * Checks the route path for logo display.
   */
  React.useEffect(() => {
    // Update the state of the admin based on changes to the profile.
    if (props.profile && props.profile._id !== profileId) {
      const updatedCookie: string = cookie.get('XSRF-TOKEN-ADMIN');
      setProfileId(props.profile._id);
      setIsAdmin(updatedCookie !== undefined);
    }

  }, [cookie, path, profileId, props.profile]);

  /**
   * Toggles the display of the search field for small screens.
   *
   * @param { React.SyntheticEvent } e - the trigger event.
   */
  const toggleSearchField: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    setSearchBar(!searchBar);
  }

  /**
   * Toggles the display of side navigation menu.
   *
   * @param { React.SyntheticEvent } e - the trigger event.
   */
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
      {searchBar ? (
        <Toolbar
          className={clsx(classes.toolbar)}
          disableGutters={true}
          style={{minHeight: '50px'}}
        >
          <SearchField toggleSearchField={toggleSearchField} />
        </Toolbar>
      ) : (
        <Grid
          className={clsx(classes.toolbar)}
          container
          justify='space-between'
          alignItems='center'
        >
          <Grid item>
            <LogoIconButton
              onClick={toggleSideNavigation}
            >
              <Logo iconOnly={true} fullWidth='30px' color='#FFF' />
              <Box className={classes.menuIconBadgeContainer}>
                <MenuIcon
                  className={clsx(classes.menuIconBadge)}
                  color='primary'
                />
              </Box>
            </LogoIconButton>
          </Grid>
          <Grid item className={clsx(classes.searchContainer)} xs={7}>
            <Grid
              alignItems='center'
              className={clsx(classes.searchButton)}
              container
            >
              <Grid
                className={clsx(classes.searchIconContainer)}
                item
              >
                <SearchRoundedIcon className={clsx(classes.searchIcon)}/>
              </Grid>
              <Grid item className={clsx(classes.searchTextContainer)}>
                <Typography
                  className={clsx(classes.searchText)}
                  variant='body1'
                >
                  {props.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {props.profile ? (
            <Grid item>
              <ProfileMenu />
            </Grid>
          ) : (
            <Grid item>
              <MenuButton
                color="inherit"
                className={clsx(classes.linkButton)}
              >
                <NavLink to="/user/login" activeClassName="active" className={classes.links}>Log in</NavLink>
              </MenuButton>
            </Grid>
          )}
        </Grid>
      )}
    </React.Fragment>
  );
}

/**
 * Map the profile to the naigation menu.
 *
 */
const mapStateToProps = (state: any, ownProps: StreamNavigationProps) => {
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
    mapStateToProps,
    mapDispatchToProps
  )(StreamNavigation)
);

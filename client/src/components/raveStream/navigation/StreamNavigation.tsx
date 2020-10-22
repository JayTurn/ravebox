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

// Enumerators.
import { LogoColor } from '../../logo/Logo.enum';

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
    fontWeight: 700,
    textDecoration: 'none',
  },
  linksColored: {
    color: theme.palette.primary.main,
    '&.active': {
      color: theme.palette.primary.main,
    },
    '&:hover': {
      color: theme.palette.primary.main,
    }
  },
  linksWhite: {
    color: theme.palette.common.white,
    '&.active': {
      color: theme.palette.common.white
    },
    '&:hover': {
      color: theme.palette.common.white
    }
  },
  linksNoHover: {
    textDecoration: 'none'
  },
  menuIconBadge: {
    height: 17,
    width: 18
  },
  menuIconBadgeColored: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  menuIconBadgeWhite: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
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
    padding: theme.spacing(0, 1)
  },
  searchButtonColored: {
    backgroundColor: theme.palette.primary.main,
  },
  searchButtonWhite: {
    backgroundColor: theme.palette.primary.main,
  },
  searchContainer: {
    flexBasis: '62%',
    flexShrink: 1,
    maxWidth: '62%'
  },
  searchIcon: {
    height: 16,
    marginTop: 6,
    width: 18
  },
  searchIconColored: {
    color: theme.palette.common.white,
  },
  searchIconWhite: {
    color: theme.palette.common.white,
  },
  searchIconContainer: {
    marginRight: theme.spacing(.5)
  },
  searchText: {
    fontSize: '.8rem',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  searchTextColored: {
    color: theme.palette.common.white,
  },
  searchTextWhite: {
    color: theme.palette.common.white,
  },
  searchTextContainer: {
    flexShrink: 1,
    overflow: 'hidden'
  },
  toolbar: {
    flexWrap: 'nowrap',
    minHeight: 52
  },
  toolbarColored: {
    padding: theme.spacing(0, .5),
    borderBottom: `2px solid ${theme.palette.primary.light}`
  },
  toolbarWhite: {
    borderBottom: `1px solid ${theme.palette.common.white}`,
    maxWidth: 'calc(100vw - 16px)',
    margin: theme.spacing(0, 1)
  }
}));

const LogoIconButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: 'transparent'
    },
    marginLeft: 0,
    marginRight: 5,
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
    e.stopPropagation();
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
          className={clsx(
            classes.toolbar, {
              [classes.toolbarWhite]: props.variant === 'white',
              [classes.toolbarColored]: props.variant === 'colored'
            }
          )}
          disableGutters={true}
          style={{minHeight: '50px'}}
        >
          <SearchField toggleSearchField={() => toggleSearchField} />
        </Toolbar>
      ) : (
        <Grid
          className={clsx(
            classes.toolbar, {
              [classes.toolbarWhite]: props.variant === 'white',
              [classes.toolbarColored]: props.variant === 'colored'
            }
          )}
          container
          justify='space-between'
          alignItems='center'
        >
          <Grid item>
            <LogoIconButton
              onClick={toggleSideNavigation}
            >
              <Logo iconOnly={true} fullWidth='30px' color={props.variant === 'white' ? LogoColor.WHITE : LogoColor.MAIN} />
              <Box className={classes.menuIconBadgeContainer}>
                <MenuIcon
                  className={clsx(
                    classes.menuIconBadge, {
                      [classes.menuIconBadgeWhite]: props.variant === 'white',
                      [classes.menuIconBadgeColored]: props.variant === 'colored'
                    })}
                  color='primary'
                />
              </Box>
            </LogoIconButton>
          </Grid>
          <Grid item className={clsx(classes.searchContainer)}>
            <Grid
              alignItems='center'
              className={clsx(classes.searchButton)}
              container
            >
              <Grid
                className={clsx(classes.searchIconContainer)}
                item
              >
                <SearchRoundedIcon className={clsx(
                  classes.searchIcon, {
                    [classes.searchIconWhite]: props.variant === 'white',
                    [classes.searchIconColored]: props.variant === 'colored'
                  }
                )}/>
              </Grid>
              <Grid item className={clsx(classes.searchTextContainer)}>
                <Typography
                  className={clsx(
                    classes.searchText, {
                      [classes.searchTextWhite]: props.variant === 'white',
                      [classes.searchTextColored]: props.variant === 'colored'
                    }
                  )}
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
                <NavLink to="/user/login" activeClassName="active" className={clsx(
                  classes.links, {
                    [classes.linksWhite]: props.variant === 'white',
                    [classes.linksColored]: props.variant === 'colored'
                  }
                )}
                >
                  Log in
                </NavLink>
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

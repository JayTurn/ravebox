/**
 * MobileNavigation.tsx
 * MobileNavigation menu component.
 */

// Modules.
import * as React from 'react';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { connect } from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import VideocamIcon from '@material-ui/icons/Videocam';
import { withRouter } from 'react-router';

// Actions.
import { toggleSide } from '../../../store/navigation/Actions';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';
import { MobileNavigationProps } from './MobileNavigation.interface';

const drawerWidth: number = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  listBox: {
    width: drawerWidth
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    width: drawerWidth
  },
  drawerOpen: {
    borderRight: '1px solid #E9EAFF',
    border: 'none',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    })
  },
  drawerClosed: {
    borderRight: '1px solid #E9EAFF',
    border: 'none',
    width: 70,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  linkStyle: {
    textDecoration: 'none',
    color: theme.palette.text.primary,
    display: 'flex'
  },
  linkStyleOpen: {
    flexDirection: 'row'
  },
  linkStyleClosed: {
    flexDirection: 'column'
  },
  listClosed: {
    width: 70
  },
  listOpen: {
    width: 240
  },
  listButton: {
    color: theme.palette.primary.main
  },
  listButtonOpen: {
    flexDirection: 'row',
    paddingLeft: 24
  },
  listButtonClosed: {
    paddingLeft: 2,
    paddingRight: 2,
    flexDirection: 'column'
  },
  listButtonIconOpen: {
    minWidth: 46,
    alignSelf: 'center'
  },
  listButtonIconClosed: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%'
  },
  listButtonIconActive: {
    color: theme.palette.primary.main,
  },
  listButtonTextOpen: {
  },
  listButtonTextClosed: {
    marginTop: 0,
    textAlign: 'center'
  },
  listButtonTextActive: {
    color: theme.palette.primary.main,
  },
  listButtonTypographyOpen: {
    fontSize: '1rem'
  },
  listButtonTypographyClosed: {
    fontSize: '.7rem'
  }
}));

/**
 * Component to manage the side navigation of the application.
 */
const MobileNavigation: React.FC<MobileNavigationProps> = (props: MobileNavigationProps) => {
  const classes = useStyles(),
        activePath: string = props.location.pathname;

  // Check if we're using a browser with an apple device.
  const isBrowser = typeof window !== 'undefined';
  const iOS = isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  /**
   * Handles the open and close handling of the drawer.
   */
  const toggleDrawer: (
    e: React.KeyboardEvent | React.MouseEvent
  ) => void = (
    e: React.KeyboardEvent | React.MouseEvent
  ): void => {
    if (
      e &&
      e.type === 'keydown' &&
      ((e as React.KeyboardEvent).key === 'Tab' ||
        (e as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    if (props.toggleSide) {
      props.toggleSide(!props.expanded);
    }
  }

  return (
    <SwipeableDrawer
      disableBackdropTransition={!iOS} 
      disableDiscovery={iOS}
      open={props.expanded}
      onOpen={toggleDrawer}
      onClose={toggleDrawer}
      anchor='left'
    >
      <Box className={clsx(classes.listBox)}>
        <List>
          <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
            <NavLink to='/' className={clsx(classes.linkStyle, classes.linkStyleOpen)}>
              <ListItemIcon className={clsx(
                classes.listButtonIconOpen,
                {[classes.listButtonIconActive]: activePath === '/'}
              )}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText disableTypography className={clsx(
                classes.listButtonTextOpen,
                {[classes.listButtonTextActive]: activePath === '/'}
              )}>
                <Typography variant='subtitle2' className={clsx(
                  classes.listButtonTypographyOpen
                )}>Home</Typography>
              </ListItemText>
            </NavLink>
          </ListItem>
          <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
            <NavLink to='/' className={clsx(classes.linkStyle, classes.linkStyleOpen)}>
              <ListItemIcon className={clsx(
                classes.listButtonIconOpen,
                {[classes.listButtonIconActive]: activePath === '/product/add'}
              )}>
                <VideocamIcon />
              </ListItemIcon>
              <ListItemText disableTypography className={clsx(
                classes.listButtonTextOpen,
                {[classes.listButtonTextActive]: activePath === '/product/add'}
              )}>
                <Typography variant='subtitle2' className={clsx(
                  classes.listButtonTypographyOpen
                )}>Rave</Typography>
              </ListItemText>
            </NavLink>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );
  /*
  return (
    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.expanded,
        [classes.drawerClosed]: !props.expanded
      })}
      classes={{paper: clsx({
          [classes.drawerOpen]: props.expanded,
          [classes.drawerClosed]: !props.expanded
        })
      }}
    >
      <List className={clsx(classes.list, {
        [classes.listOpen]: props.expanded,
        [classes.listClosed]: !props.expanded,
      })}>
        <ListItem button alignItems='center' className={clsx(classes.listButton, {
          [classes.listButtonOpen]: props.expanded,
          [classes.listButtonClosed]: !props.expanded,
        })}>
          <NavLink to='/' className={clsx(classes.linkStyle, {
            [classes.linkStyleOpen]: props.expanded,
            [classes.linkStyleClosed]: !props.expanded
          })}>
            <ListItemIcon className={clsx({
              [classes.listButtonIconOpen]: props.expanded,
              [classes.listButtonIconClosed]: !props.expanded,
              [classes.listButtonIconActive]: activePath === '/'
            })}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText disableTypography className={clsx({
              [classes.listButtonTextOpen]: props.expanded,
              [classes.listButtonTextClosed]: !props.expanded,
              [classes.listButtonTextActive]: activePath === '/'
            })}>
              <Typography variant='subtitle2' className={clsx({
                [classes.listButtonTypographyOpen]: props.expanded,
                [classes.listButtonTypographyClosed]: !props.expanded
              })}>Home</Typography>
            </ListItemText>
          </NavLink>
        </ListItem>
        <ListItem button alignItems='center' className={clsx(classes.listButton, {
          [classes.listButtonOpen]: props.expanded,
          [classes.listButtonClosed]: !props.expanded,
        })}>
          <NavLink to='/product/add' className={clsx(classes.linkStyle, {
            [classes.linkStyleOpen]: props.expanded,
            [classes.linkStyleClosed]: !props.expanded
          })}>
            <ListItemIcon className={clsx({
              [classes.listButtonIconOpen]: props.expanded,
              [classes.listButtonIconClosed]: !props.expanded,
              [classes.listButtonIconActive]: activePath === '/product/add'
            })}>
              <VideocamIcon />
            </ListItemIcon>
            <ListItemText disableTypography className={clsx({
              [classes.listButtonTextOpen]: props.expanded,
              [classes.listButtonTextClosed]: !props.expanded,
              [classes.listButtonTextActive]: activePath === '/product/add'
            })}>
              <Typography variant='subtitle2' className={clsx({
                [classes.listButtonTypographyOpen]: props.expanded,
                [classes.listButtonTypographyClosed]: !props.expanded
              })}>Rave</Typography>
            </ListItemText>
          </NavLink>
        </ListItem>
      </List>
    </Drawer>
  );
  */
}

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: MobileNavigationProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  const expanded: boolean = state.navigation ? state.navigation.display : false;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile,
    expanded
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
      toggleSide
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(MobileNavigation)
);

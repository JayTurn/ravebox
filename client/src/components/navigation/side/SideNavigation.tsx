/**
 * SideNavigation.tsx
 * SideNavigation menu component.
 */

// Modules.
import * as React from 'react';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import HomeIcon from '@material-ui/icons/Home';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import VideocamIcon from '@material-ui/icons/Videocam';
import { withRouter } from 'react-router';

// Actions.
import { toggleSide } from '../../../store/navigation/Actions';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';
import { SideNavigationProps } from './SideNavigation.interface';

const drawerWidth: number = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
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
  list: {
    marginTop: 65,
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
const SideNavigation: React.FC<SideNavigationProps> = (props: SideNavigationProps) => {
  const classes = useStyles(),
        activePath: string = props.location.pathname;

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
}

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: SideNavigationProps) {
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
      show: toggleSide
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(SideNavigation)
);

/**
 * SideNavigation.tsx
 * SideNavigation menu component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import SubscriptionsRoundedIcon from '@material-ui/icons/SubscriptionsRounded';
import Typography from '@material-ui/core/Typography';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import { withRouter } from 'react-router';

// Actions.
import { toggleSide } from '../../../store/navigation/Actions';

// Components.
import LinkElement from '../../elements/link/Link';

// Enumerators.
import { StyleType } from '../../elements/link/Link.enum';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';
import { SideNavigationProps } from './SideNavigation.interface';

const drawerWidth: number = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  copyrightText: {
    fontSize: '.8rem',
    fontWeight: 500
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
    boxShadow: '1px 0 0 #E9EAFF',
    border: 'none',
    width: 70,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  footerContainer: {
    padding: theme.spacing(2)
  },
  footerDivider: {
    margin: theme.spacing(36, 0, 0)
  },
  footerLink: {
    color: theme.palette.text.primary,
    display: 'block',
    margin: theme.spacing(1, 0),
    fontSize: '.8rem',
    fontWeight: 500,
    textDecoration: 'none'
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
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText disableTypography className={clsx({
              [classes.listButtonTextOpen]: props.expanded,
              [classes.listButtonTextClosed]: !props.expanded
            })}>
              <Typography variant='subtitle2' className={clsx({
                [classes.listButtonTypographyOpen]: props.expanded,
                [classes.listButtonTypographyClosed]: !props.expanded,
                [classes.listButtonTextActive]: activePath === '/'
              })}>Home</Typography>
            </ListItemText>
          </NavLink>
        </ListItem>
        <ListItem button alignItems='center' className={clsx(classes.listButton, {
          [classes.listButtonOpen]: props.expanded,
          [classes.listButtonClosed]: !props.expanded,
        })}>
          <NavLink to='/discover' className={clsx(classes.linkStyle, {
            [classes.linkStyleOpen]: props.expanded,
            [classes.linkStyleClosed]: !props.expanded
          })}>
            <ListItemIcon className={clsx({
              [classes.listButtonIconOpen]: props.expanded,
              [classes.listButtonIconClosed]: !props.expanded,
              [classes.listButtonIconActive]: activePath === '/discover'
            })}>
              <SubscriptionsRoundedIcon />
            </ListItemIcon>
            <ListItemText disableTypography className={clsx({
              [classes.listButtonTextOpen]: props.expanded,
              [classes.listButtonTextClosed]: !props.expanded
            })}>
              <Typography variant='subtitle2' className={clsx({
                [classes.listButtonTypographyOpen]: props.expanded,
                [classes.listButtonTypographyClosed]: !props.expanded,
                [classes.listButtonTextActive]: activePath === '/discover'
              })}>Discover</Typography>
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
              <VideocamRoundedIcon />
            </ListItemIcon>
            <ListItemText disableTypography className={clsx({
              [classes.listButtonTextOpen]: props.expanded,
              [classes.listButtonTextClosed]: !props.expanded
            })}>
              <Typography variant='subtitle2' className={clsx({
                [classes.listButtonTypographyOpen]: props.expanded,
                [classes.listButtonTypographyClosed]: !props.expanded,
                [classes.listButtonTextActive]: activePath === '/product/add'
              })}>Rave</Typography>
            </ListItemText>
          </NavLink>
        </ListItem>
        <ListItem button alignItems='center' className={clsx(classes.listButton, {
          [classes.listButtonOpen]: props.expanded,
          [classes.listButtonClosed]: !props.expanded,
        })}>
          <NavLink to='/about' className={clsx(classes.linkStyle, {
            [classes.linkStyleOpen]: props.expanded,
            [classes.linkStyleClosed]: !props.expanded
          })}>
            <ListItemIcon className={clsx({
              [classes.listButtonIconOpen]: props.expanded,
              [classes.listButtonIconClosed]: !props.expanded,
              [classes.listButtonIconActive]: activePath === '/about'
            })}>
              <InfoRoundedIcon />
            </ListItemIcon>
            <ListItemText disableTypography className={clsx({
              [classes.listButtonTextOpen]: props.expanded,
              [classes.listButtonTextClosed]: !props.expanded,
            })}>
              <Typography variant='subtitle2' className={clsx({
                [classes.listButtonTypographyOpen]: props.expanded,
                [classes.listButtonTypographyClosed]: !props.expanded,
                [classes.listButtonTextActive]: activePath === '/about'
              })}>About</Typography>
            </ListItemText>
          </NavLink>
        </ListItem>
      </List>
      {props.expanded &&
        <React.Fragment>
          <Divider className={clsx(classes.footerDivider)}/>
          <Box className={clsx(classes.footerContainer)}>
          <NavLink
            className={classes.footerLink}
            to={'/policies/terms'} 
            title='Terms of Service'
          >
            Terms of Service
          </NavLink>
          <NavLink
            className={classes.footerLink}
            to={'/policies/community-guidelines'} 
            title='Community Guidelines'
          >
            Community Guidelines
          </NavLink>
          <NavLink
            className={classes.footerLink}
            to={'/policies/privacy-policy'} 
            title='Privacy Policy'
          >
            Privacy Policy
          </NavLink>
            <Typography variant='subtitle2' className={clsx(classes.copyrightText)}>
              &copy; Copyright Ravebox 2020
            </Typography>
          </Box>
        </React.Fragment>
      }
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

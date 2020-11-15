/**
 * MobileNavigation.tsx
 * MobileNavigation menu component.
 */

// Modules.
import * as React from 'react';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';
import IconButton from '@material-ui/core/IconButton';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import PageviewRoundedIcon from '@material-ui/icons/PageviewRounded';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import SubscriptionsRoundedIcon from '@material-ui/icons/SubscriptionsRounded';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import VideocamRoundedIcon from '@material-ui/icons/VideocamRounded';
import { withRouter } from 'react-router';

// Actions.
import { toggleSide } from '../../../store/navigation/Actions';

// Components.
import Logo from '../../logo/Logo';

// Enumerators.
import { LogoColor } from '../../logo/Logo.enum';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';
import { MobileNavigationProps } from './MobileNavigation.interface';

const drawerWidth: string = 'calc(100vw)';

const useStyles = makeStyles((theme: Theme) => createStyles({
  backIconButton: {
    padding: theme.spacing(1)
  },
  backIconContainer: {
    padding: theme.spacing(1, 2)
  },
  copyrightText: {
    fontSize: '.8rem',
    fontWeight: 500
  },
  listBox: {
    width: drawerWidth,
    height: '100%'
  },
  logoContainer: {
    paddingTop: theme.spacing(1)
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
  footerContainer: {
    padding: theme.spacing(2)
  },
  footerDivider: {
    margin: theme.spacing(4, 0, 0)
  },
  footerLink: {
    color: theme.palette.text.primary,
    display: 'block',
    margin: theme.spacing(1, 0),
    fontSize: '.8rem',
    fontWeight: 500,
    textDecoration: 'none'
  },
  forwardIcon: {
    fontSize: '1.25rem',
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
    padding: theme.spacing(0)
  },
  listClosed: {
    width: 70
  },
  listOpen: {
    width: 240
  },
  listButton: {
    borderBottom: `2px solid rgba(245, 245, 245, 1)`,
    color: theme.palette.primary.main,
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  listButtonOpen: {
    flexDirection: 'row',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: 'inherit'
    }
  },
  listButtonClosed: {
    paddingLeft: 2,
    paddingRight: 2,
    flexDirection: 'column'
  },
  listButtonForwardIcon: {
    minWidth: 'auto',
    alignSelf: 'center'
  },
  listButtonIconOpen: {
    minWidth: 36,
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
    fontSize: '1.1rem'
  },
  listButtonTypographyClosed: {
    fontSize: '.7rem'
  },
  menuIcon: {
    fontSize: '1.5rem',
  },
  menuIconHome: {
    fontSize: '1.65rem',
  },
  menuTitleContainer: {
    boxShadow: `0 8px 0 0 rgba(100, 106, 240, .1)`,
    //backgroundColor: 'rgba(245, 245, 245, 1)',
  },
  menuItemsContainer: {
    height: '70vh',
    padding: theme.spacing(2)
  },
  disclaimerItemsContainer: {
    //height: '19vh'
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
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
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
    <Drawer
      open={props.expanded}
      onClose={toggleDrawer}
      anchor='left'
      variant='temporary'
    >
      <Grid container alignItems='flex-start' className={clsx(classes.listBox)}>
        <Grid item xs={12}>
          <Grid container className={clsx(classes.menuTitleContainer)}>
            <Grid item className={clsx(classes.backIconContainer)}>
              <IconButton
                className={clsx(classes.backIconButton)}
                onClick={toggleDrawer}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
            </Grid>
            <Grid item xs={9} className={clsx(classes.logoContainer)}>
              <Logo
                alignCenter={true}
                iconOnly={false}
                fullWidth='115px'
                color={LogoColor.MAIN} 
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} className={clsx(classes.menuItemsContainer)}>
          <List className={clsx(classes.list)}>
            <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
              <NavLink to='/' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                <ListItemIcon className={clsx(
                  classes.listButtonIconOpen,
                  {[classes.listButtonIconActive]: activePath === '/'}
                )}>
                  <HomeRoundedIcon className={clsx(classes.menuIconHome)}/>
                </ListItemIcon>
                <ListItemText disableTypography className={clsx(
                  classes.listButtonTextOpen,
                  {[classes.listButtonTextActive]: activePath === '/'}
                )}>
                  <Typography variant='subtitle2' className={clsx(
                    classes.listButtonTypographyOpen
                  )}>Home</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <ListItemIcon className={clsx(
                    classes.listButtonForwardIcon
                  )}>
                    <ArrowForwardIosRoundedIcon className={clsx(classes.forwardIcon)}/>
                  </ListItemIcon>
                </ListItemSecondaryAction>
              </NavLink>
            </ListItem>
            {/*
            <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
              <NavLink to='/discover' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                <ListItemIcon className={clsx(
                  classes.listButtonIconOpen,
                  {[classes.listButtonIconActive]: activePath === '/discover'}
                )}>
                  <PageviewRoundedIcon />
                </ListItemIcon>
                <ListItemText disableTypography className={clsx(
                  classes.listButtonTextOpen,
                  {[classes.listButtonTextActive]: activePath === '/discover'}
                )}>
                  <Typography variant='subtitle2' className={clsx(
                    classes.listButtonTypographyOpen
                  )}>Discover</Typography>
                </ListItemText>
              </NavLink>
            </ListItem>
            */}
            {props.profile ? (
              <React.Fragment>
                <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
                  <NavLink to='/user/following' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                    <ListItemIcon className={clsx(
                      classes.listButtonIconOpen,
                      {[classes.listButtonIconActive]: activePath === '/user/following'}
                    )}>
                      <SubscriptionsRoundedIcon  className={clsx(classes.menuIcon)} />
                    </ListItemIcon>
                    <ListItemText disableTypography className={clsx(
                      classes.listButtonTextOpen,
                      {[classes.listButtonTextActive]: activePath === '/user/following'}
                    )}>
                      <Typography variant='subtitle2' className={clsx(
                        classes.listButtonTypographyOpen
                      )}>Following</Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <ListItemIcon className={clsx(
                        classes.listButtonForwardIcon
                      )}>
                        <ArrowForwardIosRoundedIcon className={clsx(classes.forwardIcon)}/>
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                  </NavLink>
                </ListItem>
                <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
                  <NavLink to='/product/add' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                    <ListItemIcon className={clsx(
                      classes.listButtonIconOpen,
                      {[classes.listButtonIconActive]: activePath === '/product/add'}
                    )}>
                      <VideocamRoundedIcon className={clsx(classes.menuIcon)} />
                    </ListItemIcon>
                    <ListItemText disableTypography className={clsx(
                      classes.listButtonTextOpen,
                      {[classes.listButtonTextActive]: activePath === '/product/add'}
                    )}>
                      <Typography variant='subtitle2' className={clsx(
                        classes.listButtonTypographyOpen
                      )}>Rave</Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <ListItemIcon className={clsx(
                        classes.listButtonForwardIcon
                      )}>
                        <ArrowForwardIosRoundedIcon className={clsx(classes.forwardIcon)}/>
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                  </NavLink>
                </ListItem>
              </React.Fragment>
            ) : (
              <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
                {/*
                  <NavLink to='/product/add' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                    <ListItemIcon className={clsx(
                      classes.listButtonIconOpen,
                      {[classes.listButtonIconActive]: activePath === '/product/add'}
                    )}>
                      <VideocamRoundedIcon />
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
                */}
                <NavLink to='/apply' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                  <ListItemIcon className={clsx(
                    classes.listButtonIconOpen,
                    {[classes.listButtonIconActive]: activePath === '/apply'}
                  )}>
                    <AccountBoxRoundedIcon className={clsx(classes.menuIcon)} />
                  </ListItemIcon>
                  <ListItemText disableTypography className={clsx(
                    classes.listButtonTextOpen,
                    {[classes.listButtonTextActive]: activePath === '/apply'}
                  )}>
                    <Typography variant='subtitle2' className={clsx(
                      classes.listButtonTypographyOpen
                    )}>Join</Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <ListItemIcon className={clsx(
                      classes.listButtonForwardIcon
                    )}>
                      <ArrowForwardIosRoundedIcon className={clsx(classes.forwardIcon)}/>
                    </ListItemIcon>
                  </ListItemSecondaryAction>
                </NavLink>
              </ListItem>
            )}
            <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
              <NavLink to='/about' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                <ListItemIcon className={clsx(
                  classes.listButtonIconOpen,
                  {[classes.listButtonIconActive]: activePath === '/about'}
                )}>
                  <InfoRoundedIcon className={clsx(classes.menuIcon)} />
                </ListItemIcon>
                <ListItemText disableTypography className={clsx(
                  classes.listButtonTextOpen,
                  {[classes.listButtonTextActive]: activePath === '/about'}
                )}>
                  <Typography variant='subtitle2' className={clsx(
                    classes.listButtonTypographyOpen
                  )}>About</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <ListItemIcon className={clsx(
                    classes.listButtonForwardIcon
                  )}>
                    <ArrowForwardIosRoundedIcon className={clsx(classes.forwardIcon)}/>
                  </ListItemIcon>
                </ListItemSecondaryAction>
              </NavLink>
            </ListItem>
            <ListItem button className={clsx(classes.listButton, classes.listButtonOpen)}>
              <NavLink to='/frequently-asked-questions' className={clsx(classes.linkStyle, classes.linkStyleOpen)} onClick={toggleDrawer}>
                <ListItemIcon className={clsx(
                  classes.listButtonIconOpen,
                  {[classes.listButtonIconActive]: activePath === '/frequently-asked-questions'}
                )}>
                  <QuestionAnswerRoundedIcon className={clsx(classes.menuIcon)} />
                </ListItemIcon>
                <ListItemText disableTypography className={clsx(
                  classes.listButtonTextOpen,
                  {[classes.listButtonTextActive]: activePath === '/frequently-asked-questions'}
                )}>
                  <Typography variant='subtitle2' className={clsx(
                    classes.listButtonTypographyOpen
                  )}>FAQ</Typography>
                </ListItemText>
                <ListItemSecondaryAction>
                  <ListItemIcon className={clsx(
                    classes.listButtonForwardIcon
                  )}>
                    <ArrowForwardIosRoundedIcon className={clsx(classes.forwardIcon)}/>
                  </ListItemIcon>
                </ListItemSecondaryAction>
              </NavLink>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} className={clsx(classes.disclaimerItemsContainer)}>
          <Divider className={clsx(classes.footerDivider)}/>
          <Box className={clsx(classes.footerContainer)}>
            <NavLink
              className={classes.footerLink}
              onClick={toggleDrawer}
              to={'/policies/terms'} 
              title='Terms of Service'
            >
              Terms of Service
            </NavLink>
            <NavLink
              className={classes.footerLink}
              onClick={toggleDrawer}
              to={'/policies/community-guidelines'} 
              title='Community Guidelines'
            >
              Community Guidelines
            </NavLink>
            <NavLink
              className={classes.footerLink}
              onClick={toggleDrawer}
              to={'/policies/privacy-policy'} 
              title='Privacy Policy'
            >
              Privacy Policy
            </NavLink>
            <Typography variant='subtitle2' className={clsx(classes.copyrightText)}>
              &copy; Copyright Ravebox 2020
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Drawer>
  );
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

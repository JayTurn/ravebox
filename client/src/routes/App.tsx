/**
 * App.tsx
 * Base application routing.
 */

// Modules.
import * as React from 'react';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { frontloadConnect } from 'react-frontload';
import { Helmet } from 'react-helmet';
import loadable from '@loadable/component';
import { SnackbarProvider } from 'notistack';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router';
import {
  createStyles,
  makeStyles,
  Theme,
  ThemeProvider,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  login,
} from '../store/user/Actions';
import {
  add
} from '../store/xsrf/Actions';
import { updateAPIImageConfig } from '../store/configuration/Actions';

// Components.
const About = loadable(() => import('./about/About'));
const Account = loadable(() => import('./user/account/Account'));
const AddProduct = loadable(() => import('./product/add/AddProduct'));
const AddReview = loadable(() => import('./review/add/AddReview'));
const Admin = loadable(() => import('./admin/Admin'));
import { AnalyticsProvider } from '../components/analytics/Analytics.provider';
const CategoryList = loadable(() => import('./category/CategoryList'));
const Channel = loadable(() => import('./user/channel/Channel'));
const CommunityGuidelines = loadable(() => import('./policies/CommunityGuidelines'));
const Discover = loadable(() => import('./discover/Discover'));
const EditReview = loadable(() => import('./review/edit/EditReview'));
const Embed = loadable(() => import('./embed/Embed'));
const FAQ = loadable(() => import('./faq/Faq'));
const Following = loadable(() => import('./user/following/Following'));
const Home = loadable(() => import('./home/Home'));
const InvitationRequest = loadable(() => import('./invitation/InvitationRequest/InvitationRequest'));
const InvitationRequestSuccess = loadable(() => import('./invitation/InvitationRequestSuccess/InvitationRequestSuccess'));
const Login = loadable(() => import('./user/login/Login'));
const MobileNavigation = loadable(() => import('../components/navigation/mobile/MobileNavigation'));
const MyReviews = loadable(() => import('./user/reviews/MyReviews'));
const RaveStream = loadable(() => import('./stream/RaveStream'));
const PageNotFound = loadable(() => import('./page-not-found/PageNotFound'));
const PasswordReset = loadable(() => import('./user/reset/PasswordReset'));
const PasswordResetRequest = loadable(() => import('./user/reset/PasswordResetRequest'));
const PrivacyPolicy = loadable(() => import('./policies/PrivacyPolicy'));
const PrivateRoute = loadable(() => import('./privateRoute/PrivateRoute'));
const ScrollToTop = loadable(() => import('../utils/scroll/ScrollToTop'));
const Search = loadable(() => import('./discover/search/Search'));
const SideNavigation = loadable(() => import('../components/navigation/side/SideNavigation'));
const Signup = loadable(() => import('./user/signup/Signup'));
const TermsOfService = loadable(() => import('./policies/TermsOfService'));
const TopNavigation = loadable(() => import('../components/navigation/top/TopNavigation'));
const Verify = loadable(() => import('./user/verify/Verify'));
const ViewProduct = loadable(() => import('./product/view/ViewProduct'));

// Hooks.
import { useRetrieveProfile } from '../components/user/profile/useRetrieveProfile.hook';

// Interfaces.
import {
  APIImageConfig,
  RequestInterface
} from '../utils/api/Api.interface';
import {
  AppProps,
  AppState
} from './App.interface';
import { PrivateProfile } from '../components/user/User.interface';

// Theme.
import RaveboxTheme from '../theme/RaveboxTheme';
import DesktopRaveboxTheme from '../theme/DesktopRaveboxTheme';

// Dependent styles.
import './App.css';

// Utilities.
import API from '../utils/api/Api.model';

// Define the snackbar styles.
const StyledSnackbar = withStyles((theme: Theme) => ({
  variantSuccess: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white
  },
  variantError: {
    backgroundColor: theme.palette.error.dark,
    color: theme.palette.common.white
  }
}))(SnackbarProvider);

const lgOpenDrawerWidth: number = 240,
      lgClosedDrawerWidth: number = 70;

/**
 * Create styles for the shifting content.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  lgContent: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    })
  },
  lgContentOpen: {
    width: `calc(100% - ${lgOpenDrawerWidth}px)`,
    marginLeft: lgOpenDrawerWidth,
    maxWidth: `calc(100% - ${lgOpenDrawerWidth}px)`,
  },
  lgContentClosed: {
    width: `calc(100% - ${lgClosedDrawerWidth}px)`,
    marginLeft: lgClosedDrawerWidth,
    maxWidth: `calc(100% - ${lgClosedDrawerWidth}px)`,
  },
  xLgContentOpen: {
    width: `calc(100% - ${lgOpenDrawerWidth}px)`,
    marginLeft: lgOpenDrawerWidth,
  },
  xLgContentClosed: {
    width: `calc(100% - ${lgClosedDrawerWidth}px)`,
    marginLeft: lgClosedDrawerWidth
  }
}));

/**
 * Determines if default navigation is shown.
 *
 * @param { string } path - the path we're checking.
 * @param { isLargeScreen } boolean - is this a large screen.
 *
 * @return boolean
 */
const displayNavigation: (
  path: string
) => (
  isLargeScreen: boolean
) => boolean = (
  path: string
) => (
  isLargeScreen: boolean
): boolean => {

  if (isLargeScreen) {
    return true;
  }

  return !path.startsWith('/stream');
}

/**
 * Application class.
 * @class App
 */
const App: React.FC<AppProps> = (props: AppProps) => {
  // Match the large media query size.
  const theme = useTheme(),
        mediumScreen = useMediaQuery(theme.breakpoints.only('sm')),
        largeScreen = useMediaQuery(theme.breakpoints.up('md')),
        extraLargeScreen = useMediaQuery(theme.breakpoints.up('xl')),
        classes = useStyles();

  // Retrieve the user profile if we have a valid token.
  const {profileStatus} = useRetrieveProfile({
    admin: false,
    profile: props.profile,
    updateProfile: props.login,
    updateXsrf: props.updateXsrf
  });

  const [appClasses, setAppClasses] = React.useState<string>('app loading');

  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(DesktopRaveboxTheme);

  const [chooseTheme, setChooseTheme] = React.useState<number>(-1);

  const [showNavigation, setShowNavigation] = React.useState<boolean>(
    displayNavigation(props.location.pathname)(largeScreen)
  );

  /**
   * Detect changes to the location and determine if we should show the
   * main app navigation.
   */
  React.useEffect(() => props.history.listen(() => {
    setShowNavigation(displayNavigation(props.history.location.pathname)(largeScreen));
    if (props.history.location.pathname.startsWith('/stream') 
      && !props.location.pathname.startsWith('/stream')) {
      if (props.updateLoading) {
        props.updateLoading(true);
      }
    }
  }));

  React.useEffect(() => {
    if (chooseTheme < 0) {
      if (largeScreen) {
        setSelectedTheme(DesktopRaveboxTheme);
      } else {
        setSelectedTheme(RaveboxTheme);
      }
      setChooseTheme(1);
    }
    setAppClasses('app');
  }, [chooseTheme]);

  /**
   * Renders the application.
   */
  return (
    <ThemeProvider theme={selectedTheme}>
      <CssBaseline />
      <StyledSnackbar>
        <AnalyticsProvider>
          <div className={appClasses}>
            <Helmet>
              <meta charSet='utf-8' />
              <title>Ravebox</title>
              <meta name='description' content='Discover authentic video reviews of products and experiences, upload and share your own with friends on Ravebox.' />
              <link rel='canonical' href='https://ravebox.io' />
            </Helmet>
            <ScrollToTop />
            {showNavigation &&
              <TopNavigation />
            }
            {largeScreen ? (
              <SideNavigation expanded={false} />
            ) : (
              <MobileNavigation expanded={false} />
            )}
            <Container maxWidth="lg" disableGutters={true} className={clsx({
              [classes.lgContent]: largeScreen,
              [classes.lgContentOpen]: largeScreen && props.expanded,
              [classes.lgContentClosed]: largeScreen && !props.expanded
            })}>
              <Route
                render={(route: RouteComponentProps) => {
                  return (
                    <Switch location={route.location}>
                      <Route path="/stream/:streamType?/:firstPath?/:secondPath?/:thirdPath?/:fourthPath?">
                        <RaveStream />
                      </Route>
                      <PrivateRoute path="/admin" admin={true}>
                        <Admin />
                      </PrivateRoute>
                      <Route path="/about" exact={true}>
                        <About />
                      </Route>
                      <PrivateRoute exact={true} path="/account">
                        <Account />
                      </PrivateRoute>
                      <Route exact={true} path="/categories/:category">
                        <CategoryList />
                      </Route>
                      <Route path="/embed" exact={true}>
                        <Embed />
                      </Route>
                      <Route path="/frequently-asked-questions" exact={true}>
                        <FAQ />
                      </Route>
                      <Route exact={true} path="/discover/:term">
                        <Search />
                      </Route>
                      <Route exact={true} path="/discover">
                        <Discover />
                      </Route>
                      <Route exact={true} path="/policies/community-guidelines">
                        <CommunityGuidelines />
                      </Route>
                      <Route exact={true} path="/policies/privacy-policy">
                        <PrivacyPolicy />
                      </Route>
                      <Route exact={true} path="/policies/terms">
                        <TermsOfService />
                      </Route>
                      <Route exact={true} path="/apply">
                        <InvitationRequest />
                      </Route>
                      <Route exact={true} path="/apply/success">
                        <InvitationRequestSuccess />
                      </Route>
                      <Route exact={true} path="/user/login">
                        <Login />
                      </Route>
                      <Route exact={true} path="/user/signup/:invitation">
                        <Signup />
                      </Route>
                      <Route exact={true} path="/user/signup">
                        <Redirect to='/apply' />
                      </Route>
                      <PrivateRoute exact={true} path="/user/reviews">
                        <MyReviews />
                      </PrivateRoute>
                      <PrivateRoute exact={true} path="/user/following">
                        <Following />
                      </PrivateRoute>
                      <Route exact={true} path="/user/channel/:handle">
                        <Channel />
                      </Route>
                      <Route exact={true} path="/user/verify/:token">
                        <Verify />
                      </Route>
                      <Route exact={true} path="/user/reset/:token">
                        <PasswordReset />
                      </Route>
                      <Route exact={true} path="/user/reset">
                        <PasswordResetRequest />
                      </Route>
                      <PrivateRoute exact={true} path="/product/add">
                        <AddProduct />
                      </PrivateRoute>
                      <PrivateRoute exact={true} path="/product/:id/review">
                        <AddReview />
                      </PrivateRoute>
                      <Route exact={true} path="/product/:brand/:productName">
                        <ViewProduct />
                      </Route>
                      <PrivateRoute exact={true} path="/review/edit/:id">
                        <EditReview />
                      </PrivateRoute>
                      <Route exact={true} path="/">
                        <Home />
                      </Route>
                      <Route path="/page-not-found" exact={true}>
                        <PageNotFound />
                      </Route>
                      <Redirect from='*' to='/page-not-found' />
                    </Switch>
                  );
                }}
              />
            </Container>
          </div>
        </AnalyticsProvider>
      </StyledSnackbar>
    </ThemeProvider>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AppProps) {
  let profile: PrivateProfile = state.user ? state.user.profile : {_id: '', email: ''};

  const expanded: boolean = state.navigation ? state.navigation.display : false

  return {
    ...ownProps,
    expanded,
    profile
  };
}

/**
 * Map dispatch actions to properties on the application.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      login: login,
      updateXsrf: add
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(App)
);

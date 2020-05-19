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

// Components.
import About from './about/About';
import Account from './user/account/Account';
import AddProduct from './product/add/AddProduct';
import AddReview from './review/add/AddReview';
import CategoryList from './category/CategoryList';
import Discover from './discover/Discover';
import EditReview from './review/edit/EditReview';
import Home from './home/Home';
import Login from './user/login/Login';
import MobileNavigation from '../components/navigation/mobile/MobileNavigation';
import MyReviews from './user/reviews/MyReviews';
import PageNotFound from './page-not-found/PageNotFound';
import PasswordReset from './user/reset/PasswordReset';
import PasswordResetRequest from './user/reset/PasswordResetRequest';
import PrivateRoute from './privateRoute/PrivateRoute';
import Channel from './user/channel/Channel';
import ScrollToTop from '../utils/scroll/ScrollToTop';
import SideNavigation from '../components/navigation/side/SideNavigation';
import Signup from './user/signup/Signup';
import Search from './discover/search/Search';
import TopNavigation from '../components/navigation/top/TopNavigation';
import Verify from './user/verify/Verify';
import ViewProduct from './product/view/ViewProduct';
import ViewReview from './review/view/ViewReview';

// Hooks.
import { useRetrieveProfile } from '../components/user/profile/useRetrieveProfile.hook';

// Interfaces.
import { PrivateProfile } from '../components/user/User.interface';

// Models.
import API from '../utils/api/Api.model';
import { updateAPIImageConfig } from '../store/configuration/Actions';

// Dependent interfaces.
import { AppProps, AppState } from './App.interface';
import {
  APIImageConfig,
  RequestInterface
} from '../utils/api/Api.interface';

// Theme.
import RaveboxTheme from '../theme/RaveboxTheme';
import DesktopRaveboxTheme from '../theme/DesktopRaveboxTheme';

// Dependent styles.
import './App.css';

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
    profile: props.profile,
    updateProfile: props.login,
    updateXsrf: props.updateXsrf
  });

  /**
   * Renders the application.
   */
  return (
    <ThemeProvider theme={largeScreen ? DesktopRaveboxTheme : RaveboxTheme}>
      <CssBaseline />
      <StyledSnackbar>
        <div className={`app`}>
          <Helmet title="Ravebox" defaultTitle="Ravebox" />
          <ScrollToTop />
          <TopNavigation />
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
                    <Route path="/about" exact={true}>
                      <About />
                    </Route>
                    <PrivateRoute exact={true} path="/account">
                      <Account />
                    </PrivateRoute>
                    <Route exact={true} path="/categories/:category">
                      <CategoryList />
                    </Route>
                    <Route exact={true} path="/discover/:term">
                      <Search />
                    </Route>
                    <Route exact={true} path="/discover">
                      <Discover />
                    </Route>
                    <Route exact={true} path="/user/login">
                      <Login />
                    </Route>
                    <Route exact={true} path="/user/signup">
                      <Signup />
                    </Route>
                    <Route exact={true} path="/user/reviews">
                      <MyReviews />
                    </Route>
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
                    <Route exact={true} path="/product/:category/:subCategory/:brand/:productName">
                      <ViewProduct />
                    </Route>
                    <PrivateRoute exact={true} path="/review/edit/:id">
                      <EditReview />
                    </PrivateRoute>
                    <Route exact={true} path="/review/:brand/:productName/:reviewTitle">
                      <ViewReview />
                    </Route>
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

  const expanded: boolean = state.navigation ? state.navigation.display : false;

  return {
    ...ownProps,
    profile,
    expanded
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

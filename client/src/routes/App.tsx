/**
 * App.tsx
 * Base application routing.
 */

// Modules.
import * as React from 'react';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';
import { frontloadConnect } from 'react-frontload';
import { Helmet } from 'react-helmet';
import { SnackbarProvider } from 'notistack';
import { Route, Switch } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router';
import { withStyles, Theme } from '@material-ui/core/styles';

// Actions.
import {
  login,
} from '../store/user/Actions';
import {
  add,
} from '../store/xsrf/Actions';

// Components.
import { ThemeProvider } from '@material-ui/core/styles';
import AddProduct from './product/add/AddProduct';
import AddReview from './review/add/AddReview';
import ViewReview from './review/view/ViewReview';
import Home from './home/Home';
import Login from './user/login/Login';
import Navigation from '../components/navigation/Navigation';
import PageNotFound from './page-not-found/PageNotFound';
import PasswordReset from './user/reset/PasswordReset';
import PasswordResetRequest from './user/reset/PasswordResetRequest';
import PrivateRoute from './privateRoute/PrivateRoute';
import Account from './user/account/Account';
import ScrollToTop from '../utils/scroll/ScrollToTop';
import Signup from './user/signup/Signup';
import Verify from './user/verify/Verify';

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

/**
 * Application class.
 * @class App
 */
const App: React.FC<AppProps> = (props: AppProps) => {

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
    <ThemeProvider theme={RaveboxTheme}>
      <StyledSnackbar>
        <div className={`app`}>
          <Helmet title="Ravebox" defaultTitle="Ravebox" />
          <ScrollToTop />
          <Navigation />
          <Container maxWidth="lg">
            <Route
              render={(route: RouteComponentProps) => {
                return (
                  <Switch location={route.location}>
                    <Route path="/page-not-found" exact={true}>
                      <PageNotFound />
                    </Route>
                    <PrivateRoute exact={true} path="/account">
                      <Account />
                    </PrivateRoute>
                    <Route exact={true} path="/user/login">
                      <Login />
                    </Route>
                    <Route exact={true} path="/user/signup">
                      <Signup />
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
                    <Route exact={true} path="/product/add">
                      <AddProduct />
                    </Route>
                    <PrivateRoute exact={true} path="/product/:id/review">
                      <AddReview />
                    </PrivateRoute>
                    <Route exact={true} path="/review/:brand/:productName/:reviewTitle">
                      <ViewReview />
                    </Route>
                    <Route exact={true} path="/">
                      <Home />
                    </Route>
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

  return {
    ...ownProps,
    profile: profile
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

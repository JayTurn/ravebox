/**
 * App.tsx
 * Base application routing.
 */

// Modules.
import { frontloadConnect } from 'react-frontload';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RouteComponentProps } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Container from '@material-ui/core/Container';

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
import PrivateRoute from './privateRoute/PrivateRoute';
import Account from './user/account/Account';
import ScrollToTop from '../utils/scroll/ScrollToTop';
import Signup from './user/signup/Signup';

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
                  <PrivateRoute exact={true} path="/user/account">
                    <Account />
                  </PrivateRoute>
                  <Route exact={true} path="/user/login">
                    <Login />
                  </Route>
                  <Route exact={true} path="/user/signup">
                    <Signup />
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

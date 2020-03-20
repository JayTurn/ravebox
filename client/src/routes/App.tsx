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
import AddProduct from './product/add/AddProduct';
import AddReview from './review/add/AddReview';
import Home from './home/Home';
import Login from './user/login/Login';
import Navigation from '../components/navigation/Navigation';
import PageNotFound from './page-not-found/PageNotFound';
import PrivateRoute from './privateRoute/PrivateRoute';
import Profile from './user/profile/Profile';
import ScrollToTop from '../utils/scroll/ScrollToTop';

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
    <div className={`app`}>
      <Helmet title="Ravebox" defaultTitle="Ravebox" />
      <ScrollToTop />
      <Navigation />
      <Container maxWidth="lg">
        <Route
          render={(route: RouteComponentProps) => {
            return (
              <TransitionGroup>
                <CSSTransition
                  key={route.location.pathname}
                  timeout={1000}
                  classNames="fade"
                >
                  <Switch location={route.location}>
                    <Route path="/page-not-found" exact={true}>
                      <PageNotFound />
                    </Route>
                    <PrivateRoute exact={true} path="/user/profile">
                      <Profile />
                    </PrivateRoute>
                    <Route exact={true} path="/user/login">
                      <Login />
                    </Route>
                    <Route exact={true} path="/product/add">
                      <AddProduct />
                    </Route>
                    <Route exact={true} path="/product/:id/review">
                      <AddReview />
                    </Route>
                    <Route exact={true} path="/">
                      <Home />
                    </Route>
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            );
          }}
        />
      </Container>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AppProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

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

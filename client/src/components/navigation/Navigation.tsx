/**
 * Navigation.tsx
 * Navigation menu component.
 */

// Dependent modules.
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { styled } from '@material-ui/core/styles';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Cookies from 'universal-cookie';

// Actions.
import { remove } from '../../store/xsrf/Actions';
import { logout } from '../../store/user/Actions';

// Dependent interfaces.
import { NavigationProps } from './Navigation.interface';
import { PrivateProfile } from '../user/User.interface';

// Dependent styles.
import './Navigation.css';

/**
 * Component to manage the main navigation of the application.
 */
const Navigation: React.FC<NavigationProps> = (props: NavigationProps) => {

  /**
   * Handles the logout.
   * @method handleLogin
   */
  const handleLogout: (
  ) => void = (
  ): void => {

    // Remove the cookies from the application.
    const cookies: Cookies = new Cookies();
    cookies.remove('XSRF-TOKEN');

    if (props.removeXsrf) {
      // Remove the tokens and user from the redux store.
      props.removeXsrf('');
    }

    if (props.profile && props.logout) {
      props.logout(props.profile);
    }

    // Redirect to the home screen.
    props.history.push('/');

  }

  /**
   * Renders the navigation menu.
   */
  return (
    <AppBar position="static" className="block block--navigation">
      <Toolbar>
        <Button color="inherit">
          <NavLink to="/" exact activeClassName="active">
            Home
          </NavLink>
        </Button>
        <Button color="inherit">
          <NavLink to="/product/add" exact activeClassName="active">
            Add a review
          </NavLink>
        </Button>
        { props.profile &&
          <Button color="inherit">
            <NavLink to="/user/profile" activeClassName="active">Profile</NavLink>
          </Button>
        }
        {props.profile ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit">
            <NavLink to="/user/login" activeClassName="active">Login</NavLink>
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: NavigationProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile
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
      removeXsrf: remove
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(Navigation)
);

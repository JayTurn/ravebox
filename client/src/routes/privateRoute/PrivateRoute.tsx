/**
 * PrivateRoute.tsx
 * Private routing component to protect authenticate urls.
 */

// Modules.
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteProps } from 'react-router';
import { Route, Redirect } from 'react-router-dom';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';

// Actions.
import {
  login,
  logout
} from '../../store/user/Actions';

// Components.
import ScreenTransition from '../../components/placeholders/screenTransition/ScreenTransition';

// Enumerators.
import { RetrievalStatus } from '../../utils/api/Api.enum';

// Hooks.
import { useRetrieveProfile } from '../../components/user/profile/useRetrieveProfile.hook';

// Interfaces.
import { PrivateProfile } from '../../components/user/User.interface';
import { PrivateRouteProps } from './PrivateRoute.interface';

/**
 * Private route component.
 */
const PrivateRoute: React.FC<PrivateRouteProps> = (
  props: PrivateRouteProps
) => {

  // Retrieve the user profile if we have a valid token.
  const {profileStatus} = useRetrieveProfile({
    profile: props.profile,
    updateProfile: props.login,
    logout: props.logout
  });

  return (
    <Route {...props}>
      {profileStatus === RetrievalStatus.NOT_FOUND || profileStatus === RetrievalStatus.FAILED ? (
        <Redirect to={{
          pathname: '/user/login',
          state: { from: props.location }
        }} />
      ) : (
        <React.Fragment>
          {profileStatus === RetrievalStatus.SUCCESS ? (
            <React.Fragment>
              {props.children}
            </React.Fragment>
          ) : (
            <ScreenTransition />
          )}
        </React.Fragment>
      )}
    </Route>
  )
};

/**
 * Map dispatch actions to the login dialog.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      login,
      logout
    },
    dispatch
  );

/**
 * Map the user profile to the private route properties.
 *
 */
function mapStatetoProps(state: any, ownProps: PrivateRouteProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile: profile
  };
}

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(PrivateRoute);

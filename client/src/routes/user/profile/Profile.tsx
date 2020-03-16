/**
 * Profile.tsx
 * Profile route component.
 */

// Modules.
import * as React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

// Interfaces.
import { ProfileProps } from './Profile.interface';
import { PrivateProfile } from '../../../components/user/User.interface';

/**
 * Profile component.
 */
const Profile: React.FC<ProfileProps> = (props: ProfileProps) => {

  return (
    <div className="block block--profile-container">
      <h1>Profile</h1>
      {props.profile &&
        <p>Email: {props.profile.email}</p>
      }
    </div>
  );
}

/**
 * Map the redux state to the profile properties.
 *
 */
function mapStatetoProps(state: any, ownProps: ProfileProps) {
  const profile: PrivateProfile = state.user ? state.user.profile : undefined;
  return {
    ...ownProps,
    profile: profile
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(Profile));

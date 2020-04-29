/**
 * Login.tsx
 * Login route component.
 */

// Dependent modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import AccessType from '../../../components/user/accessType/AccessType';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';

// Interfaces.
import {
  SignupProps,
} from './Signup.interface';

// Dependent components.
import SignupForm from '../../../components/user/signupForm/SignupForm';

/**
 * Signup component.
 */
const Signup: React.FC<SignupProps> = (props: SignupProps) => {

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
      >
        <AccessType selected={AccessOptions.SIGNUP} />
        <SignupForm />
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: SignupProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(Signup));

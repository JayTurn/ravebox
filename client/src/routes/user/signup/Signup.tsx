/**
 * Login.tsx
 * Login route component.
 */

// Dependent modules.
import AccessType from '../../../components/user/accessType/AccessType';
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import { withRouter } from 'react-router';

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
        <Helmet>
          <title>Sign up to ravebox - ravebox</title>
          <link rel='canonical' href='https://ravebox.io/about' />
        </Helmet>
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

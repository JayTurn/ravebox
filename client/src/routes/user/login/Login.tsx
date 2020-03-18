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

// Dependent interfaces.
import {
  LoginProps,
} from './Login.interface';

// Dependent components.
import LoginForm from '../../../components/user/loginForm/LoginForm';

/**
 * Login component.
 */
const Login: React.FC<LoginProps> = (props: LoginProps) => {

  return (
    <div style={{'flexGrow': 1}}>
      <Grid
        container
        direction='column'
        justify='flex-start'
        alignItems='center'
      >
        <LoginForm />
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: LoginProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(Login));

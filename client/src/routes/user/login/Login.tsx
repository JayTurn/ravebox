/**
 * Login.tsx
 * Login route component.
 */

// Dependent modules.
import AccessType from '../../../components/user/accessType/AccessType';
import {
  AnyAction,
  bindActionCreators,
  Dispatch
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
  LoginProps,
} from './Login.interface';

// Dependent components.
import LoginForm from '../../../components/user/loginForm/LoginForm';

/**
 * Login component.
 */
const Login: React.FC<LoginProps> = (props: LoginProps) => {

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
      >
        <Helmet>
          <title>Log in - ravebox</title>
          <link rel='canonical' href='https://ravebox.io/user/login' />
        </Helmet>
        <AccessType selected={AccessOptions.LOGIN} />
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

/**
 * UserLogin.tsx
 * Login component to prompt the user for login.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import Grid from '@material-ui/core/Grid';
import Input from '../../forms/input/Input'; 
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';

// Actions.
import {
  login,
} from '../../../store/user/Actions';
import { add } from '../../../store/xsrf/Actions';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { PrivateProfile } from '../User.interface';
import {
  LoginResponse, 
  UserLoginProps,
  UserLoginState
} from './UserLogin.interface';

/**
 * Login component.
 * @class UserLogin
 */
const UserLogin: React.FC<UserLoginProps> = (props: UserLoginProps) => {

  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  });

  /**
   * Handles updates to the signup form field.
   *
   * @param { InputData } data - the field data.
   */
  const updateForm: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
    setValues({
      ...values,
      [data.key]: data.value
    });
  }

  /**
   * Requests the authentication token.
   * @method getRequestToken
   */
  const authenticate: (
  ) => void = (
  ): void => {
    //const instance: UserLogin = this;
    API.requestAPI<LoginResponse>('user/login', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    .then((response: LoginResponse) => {
      if (props.addXsrf && props.login) {
        // Retrieve the xsrf cookie to be set on the header for future requests. 
        const cookies: Cookies = new Cookies();
        const xsrf: string = cookies.get('XSRF-TOKEN');

        if (xsrf) {
          props.addXsrf(xsrf);
          props.login(response.user);
          props.history.push('/user/profile');
        }
      }
    });
  }

  /**
   * Displays the user login prompt.
   * @method render
   *
   * @return React.ReactNode
   */
  return (
    <div style={{'minWidth': '50%'}}>
      <h1>Log in</h1>
      <form noValidate autoComplete="off">
        <Grid
          container
          direction='column'
          spacing={2}
          alignItems='stretch'
        >
          <Grid item xs={12}>
            <Input
              handleChange={updateForm}
              hasError={''}
              name='email'
              required={true}
              type='email'
              title="Email" 
            />
          </Grid>
          <Grid item xs={12}>
            <Input
              handleChange={updateForm}
              hasError={''}
              name='password'
              required={true}
              type='password'
              title="Password" 
            />
          </Grid>
          <Grid item xs={12} sm={9} md={3}>
            <Button
              variant='contained'
              color='primary'
              onClick={authenticate}
            >Join</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

/**
 * Map dispatch actions to the login dialog.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      addXsrf: add,
      login: login
    },
    dispatch
  );

/**
 * Maps the user store properties to the login component.
 */
const mapStatetoProps = (state: any, ownProps: UserLoginProps): UserLoginProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(UserLogin));

/**
 * Signup.tsx
 * Component to prompt the user to sign up.
 */

// Modules.
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Cookies from 'universal-cookie';
import Typography from '@material-ui/core/Typography';

// Actions.
import {
  login,
} from '../../../store/user/Actions';
import { add } from '../../../store/xsrf/Actions';

// Components.
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '../../forms/input/Input'; 
//import { styled } from '@material-ui/core/styles';
import API from '../../../utils/api/Api.model';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { SignupProps, SignupResponse } from './Signup.interface';
import { PrivateProfile } from '../User.interface';

// Styles defined for the signup form container grid.
//const SignupGrid = styled(Grid)({
  //margin: '3rem 0'
//});

/**
 * Signup form for new accounts.
 */
const Signup: React.FC<SignupProps> = (props: SignupProps) => {
  // Define the base state for the signup form.
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  });

  // Define an error to be displayed upon unsuccessful account creation.
  const [error, setError] = React.useState('');

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
   * Submits the signup form.
   */
  const submit: (
  ) => void = (
  ): void => {
    API.requestAPI<SignupResponse>('user/signup', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    .then((response: SignupResponse) => {
      if (response.errorCode) {
        setError(response.title);
        return;
      }

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

  return(
    <div style={{'minWidth': '50%'}}>
      <h1>Join Two Review</h1>
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
          {error &&
            <Grid item xs={12}>
              <Typography style={{color: 'red'}} variant='body2' gutterBottom>
                {error}
              </Typography>
            </Grid>
          }
          <Grid item xs={12} sm={9} md={3}>
            <Button
              variant='contained'
              color='primary'
              onClick={submit}
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
 * Maps the user store properties to the signup component.
 */
const mapStatetoProps = (state: any, ownProps: SignupProps): SignupProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(Signup));

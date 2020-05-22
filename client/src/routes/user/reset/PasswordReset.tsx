/**
 * PasswordReset.tsx
 * Reset password route component.
 */

// Modules.
import * as React from 'react';
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

// Actions.
import { reset } from '../../../store/user/Actions';

// Components.
import PaddedDivider from '../../../components/elements/dividers/PaddedDivider';

// Enumerators.
import { ResetTokenStatus } from './PasswordReset.enum';
import { RequestType } from '../../../utils/api/Api.enum';

// Interfaces.
import {
  PasswordResetProps,
  PasswordResetResponse,
  TokenResponse
} from './PasswordReset.interface';

// Dependent components.
import PasswordResetForm from '../../../components/user/passwordResetForm/PasswordResetForm';

/**
 * Loads the password verification from the api before rendering the component
 * the first time.
 * 
 * @param { PasswordResetProps } props - the password reset properties.
 */
const frontloadPasswordReset = async (props: PasswordResetProps) => {
  // Format the api request path.
  const { token } = {...props.match.params};

  // Verify the email address.
  await API.requestAPI<TokenResponse>(`user/password/${token}`, {
    method: RequestType.GET
  })
  .then((response: TokenResponse) => {
    if (props.reset) {
      if (response.allowed) {
        props.reset(ResetTokenStatus.ALLOWED);
      } else {
        props.reset(ResetTokenStatus.NOT_ALLOWED);
      }
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};

/**
 * PasswordReset component.
 */
const PasswordReset: React.FC<PasswordResetProps> = (
  props: PasswordResetProps
) => {

  return (
    <Box style={{flexGrow: 1, marginTop: '3rem' }}>
      <Helmet>
        <title>Reset password - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/user/reset' />
      </Helmet>
      {props.allowed &&
        <Grid
          container
          direction='column'
          justify='flex-start'
        >
          {props.allowed === ResetTokenStatus.ALLOWED &&
            <PasswordResetForm token={props.match.params.token} />
          }
          {props.allowed === ResetTokenStatus.NOT_ALLOWED &&
            <Grid item xs={12} md={6} style={{marginBottom: '1rem'}}>
              <Typography variant='h2' color='error'>
                Password reset link not valid  
              </Typography>
              <Typography variant='body1' color='textPrimary'>
                It's possible this link has expired. Please request another password reset link and try again. 
              </Typography>
            </Grid>
          }
        </Grid>
      }
    </Box>
  );
}

/**
 * Map dispatch actions to properties on the password reset.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      reset: reset
    },
    dispatch
  );

/**
 * Map the reset token redux state to the properties.
 *
 */
function mapStateToProps(state: any, ownProps: PasswordResetProps) {
  const allowed: ResetTokenStatus | undefined = (state.user) ? state.user.reset : undefined;

  return {
    ...ownProps,
    allowed
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadPasswordReset,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(PasswordReset)
));

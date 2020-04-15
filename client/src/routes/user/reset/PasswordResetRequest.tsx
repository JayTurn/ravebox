/**
 * PasswordResetRequest.tsx
 * Reset password request route component.
 */

// Dependent modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

// Components.
import PaddedDivider from '../../../components/elements/dividers/PaddedDivider';

// Interfaces.
import {
  PasswordResetRequestProps,
} from './PasswordResetRequest.interface';

// Dependent components.
import ForgotPasswordForm from '../../../components/user/forgotPasswordForm/ForgotPasswordForm';

/**
 * PasswordReset component.
 */
const PasswordResetRequest: React.FC<PasswordResetRequestProps> = (
  props: PasswordResetRequestProps
) => {

  return (
    <div style={{flexGrow: 1, marginTop: '3rem' }}>
      <Grid
        container
        direction='column'
        justify='flex-start'
      >
        <Grid item xs={12} md={6} style={{marginBottom: '1rem'}}>
          <Typography variant='h1' color='textPrimary'>
            Account recovery
          </Typography>
        </Grid>
        <ForgotPasswordForm />
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: PasswordResetRequestProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(PasswordResetRequest));

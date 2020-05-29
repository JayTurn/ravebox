/**
 * PasswordResetRequest.tsx
 * Reset password request route component.
 */

// Dependent modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

// Components.
import PaddedDivider from '../../../components/elements/dividers/PaddedDivider';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

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
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>Account recovery - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/user/reset' />
      </Helmet>
      <PageTitle title='Account recovery' />
      <ForgotPasswordForm />
    </Grid>
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

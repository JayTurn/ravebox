/**
 * Account.tsx
 * Account route component.
 */

// Dependent modules.
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';

// Components.
import Settings from '../../../components/user/settings/Settings';

// Interfaces.
import {
  AccountProps,
} from './Account.interface';

/**
 * Account component.
 */
const Account: React.FC<AccountProps> = (props: AccountProps) => {

  return (
    <div style={{flexGrow: 1, marginTop: '3rem' }}>
      <Grid
        container
        direction='column'
        justify='flex-start'
      >
        <Helmet>
          <title>Account settings - ravebox</title>
          <link rel='canonical' href='https://ravebox.io/account' />
        </Helmet>
        <Settings />
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: AccountProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
  mapStatetoProps
)(Account));

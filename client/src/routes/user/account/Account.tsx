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

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import {
  AccountProps,
} from './Account.interface';
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';

/**
 * Account component.
 */
const Account: React.FC<AccountProps> = (props: AccountProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: props.location.pathname,
          title: 'Account settings'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed]);


  return (
    <div style={{flexGrow: 1, marginTop: '3rem' }}>
      <Grid
        container
        direction='column'
        justify='flex-start'
      >
        <Helmet>
          <title>Account settings - Ravebox</title>
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

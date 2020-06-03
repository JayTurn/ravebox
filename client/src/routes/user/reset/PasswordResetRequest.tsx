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

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
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
          title: 'Account recovery'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed, props.location.pathname]);

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

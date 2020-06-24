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

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  LoginProps,
} from './Login.interface';

// Dependent components.
import LoginForm from '../../../components/user/loginForm/LoginForm';

/**
 * Login component.
 */
const Login: React.FC<LoginProps> = (props: LoginProps) => {
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
          title: 'Log in'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed]);

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
      >
        <Helmet>
          <title>Log in - ravebox</title>
          <meta name='description' content={`Log in to Ravebox and start sharing your video reviews of products and unique experiences.`} />
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

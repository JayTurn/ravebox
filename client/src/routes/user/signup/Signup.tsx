/**
 * Login.tsx
 * Login route component.
 */

// Dependent modules.
import AccessType from '../../../components/user/accessType/AccessType';
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
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
  SignupProps,
} from './Signup.interface';

// Dependent components.
import SignupForm from '../../../components/user/signupForm/SignupForm';

/**
 * Signup component.
 */
const Signup: React.FC<SignupProps> = (props: SignupProps) => {

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
          title: 'Sign up'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed, props.location.pathname]);

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
      >
        <Helmet>
          <title>Sign up to ravebox - ravebox</title>
          <meta name='description' content={`Create an account on Ravebox to share your video reviews of products and experiences.`} />
          <link rel='canonical' href='https://ravebox.io/about' />
        </Helmet>
        <AccessType selected={AccessOptions.SIGNUP} />
        <SignupForm />
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: SignupProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(Signup));

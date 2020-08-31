/**
 * InvitationRequest.tsx
 * InvitationReqest route component.
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

// Components.
import InvitationRequestForm from '../../../components/invitation/invitationRequestForm/InvitationRequestForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  InvitationRequestProps,
} from './InvitationRequest.interface';

/**
 * InvitationRequest component.
 */
const InvitationRequest: React.FC<InvitationRequestProps> = (props: InvitationRequestProps) => {

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
          title: 'Apply to join'
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
          <title>Apply to join the waitlist - Ravebox</title>
          <meta name='description' content={`Apply to join the Ravebox waitlist. Ravebox is a place to share videos videos talking about your experiences with products and become a trusted source for recommendations and advice.`} />
          <link rel='canonical' href='https://ravebox.io/apply' />
        </Helmet>
        <PageTitle title='Want to become a raver?' />
        <InvitationRequestForm />
      </Grid>
    </div>
  );
}

/**
 * Map the invitation request state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: InvitationRequestProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(InvitationRequest));

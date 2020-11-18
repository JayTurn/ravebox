/**
 * EditReview.tsx
 * EditReview route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import { connect } from 'react-redux';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/review/Actions';

// Components.
import EditReviewForm from '../../../components/review/editForm/EditReviewForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';
import ProductPreview from '../../../components/product/preview/ProductPreview';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { EditReviewProps } from './EditReview.interface';
import {
  Review,
  ReviewResponse
} from '../../../components/review/Review.interface';

// Hooks.
import { useRetrieveReviewById } from '../../../components/review/useRetrieveReviewById.hook';

/**
 * EditReview component.
 */
const EditReview: React.FC<EditReviewProps> = (props: EditReviewProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const {
    review,
    reviewStatus,
  } = useRetrieveReviewById({id: props.match.params.id, xsrf: props.xsrf});

  const [displayProduct, setDisplayProduct] = React.useState<boolean>(false);

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed && review._id) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: `Edit your rave`
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed, review]);

  /**
   * Toggles the display of the product details.
   */
  const toggleProduct: (
    visible: boolean
  ) => void = (
    visible: boolean
  ): void => {
    setDisplayProduct(visible);
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='stretch'
      style={{marginBottom: '3rem'}}
    >
      {reviewStatus === RetrievalStatus.SUCCESS &&
        <React.Fragment>
          {review.product &&
            <Helmet>
              <title>Edit your {review.product.brand.name} {review.product.name} review - Ravebox</title>
              <link rel='canonical' href='https://ravebox.io/about' />
            </Helmet>
          }
          <PageTitle title='Edit your rave' />
          {review && review.product &&
            <EditReviewForm
              review={review}
              toggleProduct={toggleProduct}
            />
          }
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map the redux state to the add review properties.
 *
 */
function mapStatetoProps(state: any, ownProps: EditReviewProps) {

  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default withRouter(connect(
  mapStatetoProps
)(EditReview));

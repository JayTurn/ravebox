/**
 * ViewReview.tsx
 * ViewReview route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import { frontloadConnect } from 'react-frontload';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/review/Actions';

// Components.
import ReviewDetails from '../../../components/review/details/ReviewDetails';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useRetrieveReviewByURL } from '../../../components/review/useRetrieveReviewByURL.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
import {
  Review,
  ReviewResponse
} from '../../../components/review/Review.interface';
import { ViewReviewProps } from './ViewReview.interface';

// Utilities.
import { CommaSeparatedNumber } from '../../../utils/display/numeric/Numeric';
import { formatReviewProperties } from '../../../components/review/Review.common';

/**
 * Loads the review from the api before rendering the component the first time.
 * 
 * @param { ReviewDetailsProps } props - the review details properties.
 */
const frontloadReviewDetails = async (props: ViewReviewProps) => {
  // Format the api request path.
  const { brand, productName, reviewTitle } = {...props.match.params};

  // If we don't have a review title, redirect.
  const path: string = `${brand}/${productName}/${reviewTitle}`;

  await API.requestAPI<ReviewResponse>(`review/view/${path}`, {
    method: RequestType.GET
  })
  .then((response: ReviewResponse) => {
    if (props.updateActive) {
      props.updateActive(response.review);
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};


/**
 * Route to retrieve a review and present the display components.
 */
const ViewReview: React.FC<ViewReviewProps> = (props: ViewReviewProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const {review, reviewStatus} = useRetrieveReviewByURL({
    existing: props.review ? props.review.url : '',
    review: props.review,
    setReview: props.updateActive,
    requested: props.match.params
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * On updates, check if we need to track the page view.
   */
  React.useEffect(() => {
    if (!pageViewed && review && review._id && review.user && review.product) {

      const data: EventObject = formatReviewProperties(review);

      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: `${review.user.handle} reviews ${review.product.brand} ${review.product.name}`
        },
        data: data,
        amplitude: {
          label: 'view review'
        }
      });
      analytics.trackEvent('view review')(data);

      setPageViewed(true);
    }
  }, [pageViewed, review]);

  return (
    <Grid container direction='column' alignItems='flex-start'>
      {props.review && props.review._id &&
        <React.Fragment>
          {props.review.user && props.review.product &&
            <Helmet>
              <title>{props.review.user.handle} reviews {props.review.product.brand} {props.review.product.name} - Ravebox</title>
              <meta name='description' content={`Watch the ${props.review.product.brand} ${props.review.product.name} review video created and shared by ${props.review.user.handle} on Ravebox.`} />
              <link rel='canonical' href={`https://ravebox.io/review/${props.review.url}`} />
              <meta name='og:site_name' content={`Ravebox`} />
              <meta name='og:title' content={`${props.review.product.brand} ${props.review.product.name} review by ${props.review.user.handle} - Ravebox`} />
              <meta name='og:description' content={`Watch the ${props.review.product.brand} ${props.review.product.name} review video created and shared by ${props.review.user.handle} on Ravebox.`} />
              <meta name='og:image' content={`${props.review.thumbnail}`} />
              <meta name='og:url' content={`https://ravebox.io/review/${props.review.url}`} />
              <meta name='twitter:title' content={`${props.review.product.brand} ${props.review.product.name} review by ${props.review.user.handle} - Ravebox`} />
              <meta name='twitter:description' content={`Watch the ${props.review.product.brand} ${props.review.product.name} review video created and shared by ${props.review.user.handle} on Ravebox.`} />
              <meta name='twitter:image' content={`${props.review.thumbnail}`} />
              <meta name='twitter:image:alt' content={`Preview image for ${props.review.user.handle}'s review of the ${props.review.product.brand} ${props.review.product.name}`} />
              <meta name='twitter:card' content={`summary_large_image`} />
            </Helmet>
          }
          <ReviewDetails
            key={props.review._id}
            review={props.review}
          />
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the review.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateActive: updateActive
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ViewReviewProps) => {
  // Retrieve the review from the active properties.
  const review: Review = state.review ? state.review.active : undefined;

  return {
    ...ownProps,
    review 
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadReviewDetails, {
    noServerRender: false,
    onMount: true,
    onUpdate: false
  }
)(ViewReview)
));

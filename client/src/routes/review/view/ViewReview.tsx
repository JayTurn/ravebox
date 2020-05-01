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
import { useRetrieveReviewByURL } from '../../../components/review/useRetrieveReviewByURL.hook';

// Interfaces.
import { ViewReviewProps } from './ViewReview.interface';
import {
  Review,
  ReviewResponse
} from '../../../components/review/Review.interface';

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
  const {review, reviewStatus} = useRetrieveReviewByURL({
    existing: props.review ? props.review.url : '',
    review: props.review,
    setReview: props.updateActive,
    requested: props.match.params
  })

  return (
    <Grid container direction='column' alignItems='flex-start'>
      {props.review &&
        <ReviewDetails key={props.review._id}/>
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
  frontloadReviewDetails,
  {
    noServerRender: false,     
    onMount: false,
    onUpdate: false
  })(ViewReview)
));

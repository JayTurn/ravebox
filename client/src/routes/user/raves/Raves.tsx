/**
 * UserRaves.tsx
 * UserRaves route component.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { frontloadConnect } from 'react-frontload';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';

// Actions.
import { setRaves } from '../../../store/user/Actions';

// Components.
import ReviewDetails from '../../../components/review/details/ReviewDetails';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import { UserRavesProps } from './Raves.interface';
import {
  Review,
  ReviewsResponse
} from '../../../components/review/Review.interface';

/**
 * Loads the user's reviews from the api before rendering the component the
 * first time.
 * 
 * @param { ReviewDetailsProps } props - the review details properties.
 */
const frontloadReviewDetails = async (props: UserRavesProps) => {
  // Format the api request path.
  const { username } = {...props.match.params};

  // If we don't have a review title, redirect.

  await API.requestAPI<ReviewsResponse>(`review/list/user/${username}`, {
    method: RequestType.GET
  })
  .then((response: ReviewsResponse) => {
    if (props.setRaves) {
      props.setRaves(response.reviews);
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};


/**
 * Route to retrieve a review and present the display components.
 */
const UserRaves: React.FC<UserRavesProps> = (props: UserRavesProps) => {

  return (
    <Grid container direction='column'>
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
      setRaves
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: UserRavesProps) => {
  // Retrieve the review from the active properties.
  const raves: Array<Review> = state.user ? state.user.raves : [];

  return {
    ...ownProps,
    raves 
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadReviewDetails,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(UserRaves)
));

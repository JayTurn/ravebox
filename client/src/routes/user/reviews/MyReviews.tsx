/**
 * MyReviews.tsx
 * Route for retrieving the authenticated user's reviews.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { withRouter } from 'react-router';

// Actions.
import { setReviews } from '../../../store/user/Actions';

// Components.
import PrivateReviews from '../../../components/user/privateReviews/PrivateReviews';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Hooks.
import { useRetrievePrivateReviews } from '../../../components/user/privateReviews/useRetrievePrivateReviews.hook';

// Interfaces.
import { MyReviewsProps } from './MyReviews.interface';
import { PrivateReview } from '../../../components/review/Review.interface';

/**
 * Route to retrieve the currently authenticated user's reviews.
 */
const MyReviews: React.FC<MyReviewsProps> = (props: MyReviewsProps) => {
  // Retieve the reviews for the current user.
  const {
    reviewsStatus,
  } = useRetrievePrivateReviews({
    reviews: props.reviews,
    setReviews: props.setReviews,
    xsrf: props.xsrf
  });

  return (
    <Grid container direction='column'>
      <Helmet>
        <title>My raves - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/user/reviews' />
      </Helmet>
      <PageTitle title='My raves' />
      <PrivateReviews reviews={[...props.reviews || []]} retrievalStatus={reviewsStatus} />
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the verification.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setReviews
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: MyReviewsProps) => {
  // Retrieve the reviews from the redux store.
  const reviews: Array<PrivateReview> = state.user ? state.user.reviews : [];
    
  // Retrieve the xsrf token to be submitted with the request.
  const xsrf: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    reviews,
    xsrf
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(MyReviews));

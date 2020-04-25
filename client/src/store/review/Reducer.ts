/**
 * Reducer.ts
 * Reducer for the review store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { Recommended } from '../../components/review/recommendation/Recommendation.enum';
import { ReviewVerb } from './Actions.enum';

// Interfaces.
import { Review } from '../../components/review/Review.interface';
import {
  ReviewStore,
  ReviewAction
} from './review.interface';

const emptyReview: Review = {
  _id: '',
  created: new Date(),
  title: '',
  recommended: Recommended.RECOMMENDED,
  url: ''
}

/**
 * Combines the user reducers to be loaded with the store.
 */
export default combineReducers<ReviewStore, ReviewAction>({
  /**
   * Define the active review reducer.
   *
   * @param { boolean } state - the current review state.
   * @param { ReviewAction } action - the filters action.
   *
   * @return Review
   */
  active: (review: Review = emptyReview, action: ReviewAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ReviewVerb.UPDATE_ACTIVE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return review;
    }
  },

  /**
   * Define the review list reducer.
   *
   * @param { Array<Review> } reviews - the current list of reviews state.
   * @param {  } action - the filters action.
   *
   * @return Array<Review>
   */
  list: (review: Array<Review> = [emptyReview], action: ReviewAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ReviewVerb.UPDATE_LIST:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return review;
    }
  }
});

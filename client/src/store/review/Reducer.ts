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
import {
  Review,
  ReviewGroup
} from '../../components/review/Review.interface';
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

const emptyReviewList: ReviewGroup = {
  'default': [JSON.parse(JSON.stringify(emptyReview))],
};

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
  active: (review: Review = JSON.parse(JSON.stringify(emptyReview)), action: ReviewAction) => {
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
   * Define the review list by product reducer.
   *
   * @param { Array<Review> } reviews - the current list of reviews state.
   * @param { ReviewAction } action - the filters action.
   *
   * @return Array<Review>
   */
  listByProduct: (
    review: ReviewGroup = JSON.parse(JSON.stringify(emptyReviewList)),
    action: ReviewAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ReviewVerb.UPDATE_LIST_BY_PRODUCT:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return review;
    }
  },

  /**
   * Define the review list by category reducer.
   *
   * @param { Array<Review> } reviews - the current list of reviews state.
   * @param { ReviewAction } action - the filters action.
   *
   * @return Array<Review>
   */
  listByCategory: (
    review: ReviewGroup = JSON.parse(JSON.stringify(emptyReviewList)),
    action: ReviewAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ReviewVerb.UPDATE_LIST_BY_CATEGORY:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return review;
    }
  }
});

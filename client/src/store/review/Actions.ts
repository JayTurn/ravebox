/**
 * Actions.ts
 * Review actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { ReviewVerb } from './Actions.enum';

// Dependent interfaces.
import { Review } from '../../components/review/Review.interface';

/**
 * Updates the active review in the redux store.
 *
 * @param { Review } review - the review to be made active.
 */
export const updateActive = (review: Review) => action(
  ReviewVerb.UPDATE_ACTIVE, review);

/**
 * Updates a list of reviews by product in the redux store.
 *
 * @param { Array<Review> } reviews - the list of reviews to be made active.
 */
export const updateListByProduct = (reviews: Array<Review>) => action(
  ReviewVerb.UPDATE_LIST_BY_PRODUCT, reviews);

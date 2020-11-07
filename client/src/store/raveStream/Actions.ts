/**
 * Actions.ts
 * Rave stream actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { RaveStreamVerb } from './Actions.enum';

// Dependent interfaces.
import {
  RaveStream,
  RaveStreamList
} from '../../components/raveStream/RaveStream.interface';
import { Review } from '../../components/review/Review.interface';
import {
  Product
} from '../../components/product/Product.interface';

/**
 * Updates the active stream in the redux store.
 *
 * @param { Stream } raveStream - the rave stream to be made active.
 */
export const update = (raveStream: RaveStream) => action(
  RaveStreamVerb.UPDATE, raveStream);

/**
 * Updates the active index of the current stream review in the redux store.
 *
 * @param { number } index - the review index to be made active.
 */
export const updateActive = (index: number) => action(
  RaveStreamVerb.UPDATE_ACTIVE, index);

/**
 * Updates a list of streams.
 *
 * @param { RaveStreamList } raveStreamList - the list of rave streams.
 */
export const updateList = (raveStreamList: RaveStreamList) => action(
  RaveStreamVerb.UPDATE_LIST, raveStreamList);

/**
 * Updates the product associated with rave stream in the redux store.
 *
 * @param { Product } product - the product to be made active.
 */
export const updateProduct = (product: Product) => action(
  RaveStreamVerb.UPDATE_PRODUCT, product);

/**
 * Updates the review associated with rave stream in the redux store.
 *
 * @param { Review } review - the review to be made active.
 */
export const updateReview = (review: Review) => action(
  RaveStreamVerb.UPDATE_REVIEW, review);

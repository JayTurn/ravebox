/**
 * Reducer.ts
 * Reducer for the stream store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { RaveStreamVerb } from './Actions.enum';

// Interfaces.
import {
  Product
} from '../../components/product/Product.interface';
import { Review } from '../../components/review/Review.interface';
import {
  RaveStream,
  RaveStreamList
} from '../../components/raveStream/RaveStream.interface';
import {
  RaveStreamStore,
  RaveStreamAction
} from './raveStream.interface';

// Utilities.
import { emptyProduct } from '../../components/product/Product.common';
import { emptyRaveStream } from '../../components/raveStream/RaveStream.common';
import { emptyReview } from '../../components/review/Review.common';

const emptyStream: RaveStream = emptyRaveStream();

/**
 * Combines the rave stream reducers to be loaded with the store.
 */
export default combineReducers<RaveStreamStore, RaveStreamAction>({
  /**
   * Define the active rave stream reducer.
   *
   * @param { RaveStream } state - the current rave stream.
   * @param { RaveStreamAction } action - the filters action.
   *
   * @return RaveStream
   */
  active: (
    index: number = 0,
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE_ACTIVE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return index;
    }
  },

  /**
   * Define the loaded rave stream reducer.
   *
   * @param { RaveStream } state - the current rave stream.
   * @param { RaveStreamAction } action - the filters action.
   *
   * @return RaveStream
   */
  raveStream: (
    raveStream: RaveStream = JSON.parse(JSON.stringify(emptyStream)),
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return raveStream;
    }
  },

  /**
   * Define the loaded rave stream list reducer.
   *
   * @param { RaveStreamList } state - the current rave stream list.
   * @param { RaveStreamAction } action - the update action.
   *
   * @return RaveStreamList
   */
  raveStreamList: (
    raveStreamList: RaveStreamList = {
      title: '',
      raveStreams: [JSON.parse(JSON.stringify(emptyStream))]
    },
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE_LIST:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return raveStreamList;
    }
  },

  /**
   * Define the loaded rave stream product reducer.
   *
   * @param { Product } state - the current rave stream product.
   * @param { RaveStreamAction } action - the filters action.
   *
   * @return Product
   */
  product: (
    state: Product = JSON.parse(JSON.stringify(emptyProduct())),
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE_PRODUCT:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return state;
    }
  },

  /**
   * Define the loaded rave stream review reducer.
   *
   * @param { Review } state - the current rave stream review.
   * @param { RaveStreamAction } action - the filters action.
   *
   * @return Review
   */
  review: (
    state: Review = JSON.parse(JSON.stringify(emptyReview())),
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE_REVIEW:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return state;
    }
  },
});

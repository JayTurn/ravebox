/**
 * Interfaces for the rave stream store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import {
  RaveStream,
  RaveStreamCategoryList,
  RaveStreamList
} from '../../components/raveStream/RaveStream.interface';
import { Review } from '../../components/review/Review.interface';
import {
  Product
} from '../../components/product/Product.interface';

/**
 * Redux stream action type.
 */
export type RaveStreamAction = ActionType<typeof actions>;

/**
 * Rave stream store interface.
 */
export interface RaveStreamStore {
  active: number;
  activeCategory: number;
  backPath: string;
  categoryList: Array<RaveStreamCategoryList>;
  raveStream: RaveStream;
  raveStreamList: RaveStreamList;
  product: Product;
  review: Review;
}

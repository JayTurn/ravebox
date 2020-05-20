/**
 * Interfaces for the product store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import {
  ProductView,
} from '../../components/product/Product.interface';

/**
 * Redux product action type.
 */
export type ProductAction = ActionType<typeof actions>;

/**
 * Product store interface.
 */
export interface ProductStore {
  active: ProductView;
}

/**
 * Actions.ts
 * Product actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { ProductVerb } from './Actions.enum';

// Dependent interfaces.
import {
  ProductView
} from '../../components/product/Product.interface';

/**
 * Updates the active product in the redux store.
 *
 * @param { Product } review - the review to be made active.
 */
export const updateActive = (product: ProductView) => action(
  ProductVerb.UPDATE_ACTIVE, product);

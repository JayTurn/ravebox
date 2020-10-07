/**
 * Reducer.ts
 * Reducer for the product store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { ProductVerb } from './Actions.enum';
import {
  Recommended
} from '../../components/review/recommendation/Recommendation.enum';

// Interfaces.
import {
  Review,
} from '../../components/review/Review.interface';
import {
  Product,
  ProductView
} from '../../components/product/Product.interface';
import {
  ProductStore,
  ProductAction
} from './product.interface';

// Utilities.
import { emptyProduct } from '../../components/product/Product.common';

const emptyProductView: ProductView = {
  product: emptyProduct(),
  reviews: []
}

/**
 * Combines the product reducers to be loaded with the store.
 */
export default combineReducers<ProductStore, ProductAction>({
  /**
   * Define the active review reducer.
   *
   * @param { ProductView } state - the current product view.
   * @param { ReviewAction } action - the filters action.
   *
   * @return Review
   */
  active: (
    product: ProductView = JSON.parse(JSON.stringify(emptyProductView)),
    action: ProductAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ProductVerb.UPDATE_ACTIVE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return product;
    }
  }
});

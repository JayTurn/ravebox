/**
 * Produce.common.tsx
 * Common functions for products.
 */

// Enumerators.

// Interface.
import { Product } from './Product.interface';

// Utilities.
import { emptyTag } from '../tag/Tag.common';
import { emptyBrand } from '../brand/Brand.common';

/**
 * Creates an empty Product object for use in object definitions.
 *
 * @return EventObject
 */
export const emptyProduct: (
) => Product = (
): Product => {
  return {
    _id: '',
    brand: emptyBrand(),
    category: emptyTag(),
    name: '',
    productType: emptyTag(),
    tags: [],
    url: ''
  };
}

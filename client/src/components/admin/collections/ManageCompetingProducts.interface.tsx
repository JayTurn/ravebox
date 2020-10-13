/**
 * ManageCompetingProducts.interface.tsx
 * Interfaces for managing competing products.
 */

// Enumerators.
import { CollectionContext } from '../../collection/Collection.enum';

// Interfaces.
import { Collection } from '../../collection/Collection.interface';
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../../product/Product.interface';

/**
 * Add to collection component properties.
 */
export interface ManageCompetingProductsProps {
  context: CollectionContext; 
  product: Product;
  title: string;
  xsrf?: string;
}

/**
 * Interface for the update collection response.
 */
export interface CollectionsFormResponse extends APIResponse {
  collections: Array<Collection>;
}

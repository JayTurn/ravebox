/**
 * AdminUpdateCollection.interface.tsx
 * Interfaces for updating collections.
 */

// Enumerators.
import { CollectionContext } from '../../collection/Collection.enum';

// Interfaces.
import { Collection } from '../../collection/Collection.interface';
import { Product } from '../../product/Product.interface';

/**
 * Admin update collection component.
 */
export interface AdminUpdateCollectionProps {
  add: (collection: Collection) => void;
  context: CollectionContext;
  create: (productId: string) => (title: string) => void;
  existingProductId: string;
  product: Product;
  remove: (collection: Collection) => void;
}

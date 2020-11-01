/**
 * SimilarProducts.interface.tsx
 * Interfaces for the similar products tab.
 */

// Interface.
import { Product } from '../../product/Product.interface';

/**
 * Properties for the product specifications.
 */
export interface SimilarProductsProps {
  product: Product;
  updateHeight: (value: number) => void;
}

/**
 * Retrive similar product stream params.
 */
export interface RetrieveSimilarProductParams {
  product: Product;
}

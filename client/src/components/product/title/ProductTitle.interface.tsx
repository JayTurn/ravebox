/**
 * ProductTitle.interface.tsx
 * Interface for the product title component.
 */

// Interfaces.
import { Product } from '../Product.interface';

/**
 * Product title properties.
 */
export interface ProductTitleProps {
  product?: Product;
  variant?: 'h1' | 'h2' | 'h3';
  size?: 'small' | 'large';
}

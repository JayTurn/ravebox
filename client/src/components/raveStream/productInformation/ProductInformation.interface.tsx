/**
 * ProductInformation.interface.tsx
 * Interfaces for the product information.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';

/**
 * Properties for the product information.
 */
export interface ProductInformationProps {
  index: number;
  product: Product;
  value: number;
}

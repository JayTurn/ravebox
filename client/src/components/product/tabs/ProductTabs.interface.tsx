/**
 * ProductTabs.interface.tsx
 * Interfaces for the product tabs.
 */

// Interfaces.
import { Product } from '../Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';

/**
 * ProductTabs properties.
 */
export interface ProductTabsProps {
  product: Product;
  raveStream: RaveStream;
}

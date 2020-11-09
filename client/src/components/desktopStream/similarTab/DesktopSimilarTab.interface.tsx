/**
 * DesktopSimilarTab.interface.tsx
 * Interfaces for the desktop similar products tab.
 */

// Interface.
import { Product } from '../../product/Product.interface';

/**
 * Properties for the desktop similar products tab.
 */
export interface DesktopSimilarTabProps {
  product: Product;
  updateHeight: (value: number) => void;
}

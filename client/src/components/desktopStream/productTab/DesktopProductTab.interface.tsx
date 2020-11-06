/**
 * DesktopProductTab.interface.tsx
 * Interfaces for the desktop product tab.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';

/**
 * Properties for the desktop product tab.
 */
export interface DesktopProductTabProps {
  product: Product;
  updateHeight: (value: number) => void;
}

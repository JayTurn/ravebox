/**
 * DesktopStreamTabs.interface.tsx
 * Interfaces for the desktop rave actions.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * DesktopStreamTabs properties.
 */
export interface DesktopStreamTabsProps {
  activeIndex?: number;
  product: Product;
  raveStream?: RaveStream;
  review?: Review;
}

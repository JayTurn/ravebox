/**
 * DesktopSideStream.interface.tsx
 * Interfaces for the rave stream product details.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * DesktopSideStream properties.
 */
export interface DesktopSideStreamProps {
  activeIndex?: number;
  product: Product;
  raveStream?: RaveStream;
  review?: Review;
}

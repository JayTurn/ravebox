/**
 * DesktopRaveTab.interface.tsx
 * Interfaces for the rave tab on desktop.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Properties for the rave information.
 */
export interface DesktopRaveTabProps {
  product: Product;
  raveStream?: RaveStream;
  review?: Review;
  updateHeight: (value: number) => void;
}

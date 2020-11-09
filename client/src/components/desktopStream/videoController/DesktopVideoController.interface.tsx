/**
 * DesktopVideoController.interface.tsx
 * Interfaces for the video controller.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * DesktopVideoController properties.
 */
export interface DesktopVideoControllerProps {
  activeIndex?: number;
  product?: Product;
  raveStream?: RaveStream;
  updateActiveIndex?: (index: number) => void;
  updateProduct?: (product: Product) => void;
}

/**
 * StreamProductDetails.interface.tsx
 * Interfaces for the rave stream product details.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * StreamProductDetails properties.
 */
export interface StreamProductDetailsProps {
  activeIndex?: number;
  product: Product;
  raveStream?: RaveStream;
  review?: Review;
}

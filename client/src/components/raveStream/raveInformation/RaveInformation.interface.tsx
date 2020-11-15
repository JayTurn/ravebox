/**
 * RaveInformation.interface.tsx
 * Interfaces for the rave information shown in a stream.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Properties for the rave information.
 */
export interface RaveInformationProps {
  activeIndex?: number;
  index: number;
  product: Product;
  raveStream?: RaveStream;
  review?: Review;
  updateHeight: (value: number) => void;
  value: number;
}

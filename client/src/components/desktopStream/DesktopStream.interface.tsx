/**
 * DesktopStream.interface.tsx
 * Interfaces for the swipeable rave stream component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  Product
} from '../product/Product.interface';
import {
  RaveStream,
  RaveStreamURLParams
} from '../raveStream/RaveStream.interface';
import { Review } from '../review/Review.interface';

/**
 * DesktopStream properties.
 */
export interface DesktopStreamProps extends RouteComponentProps<RaveStreamURLParams> {
  activeIndex?: number;
  loading?: boolean;
  product?: Product;
  ravePath?: string;
  raveStream?: RaveStream;
  review?: Review;
  updateActiveRaveStream?: (raveStream: RaveStream) => void;
  updateActiveIndex?: (index: number) => void;
  updateLoading?: (loading: boolean) => void;
  updateProduct?: (product: Product) => void;
  updateReview?: (review: Review) => void;
}

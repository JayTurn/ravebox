/**
 * SwipeStream.interface.tsx
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
 * SwipeStream properties.
 */
export interface SwipeStreamProps extends RouteComponentProps<RaveStreamURLParams> {
  activeIndex?: number;
  backPath?: string;
  loading?: boolean;
  product?: Product;
  ravePath?: string;
  raveStream?: RaveStream;
  review?: Review;
  updateActiveRaveStream?: (raveStream: RaveStream) => void;
  updateActiveIndex?: (index: number) => void;
  updateLoading?: (loading: boolean) => void;
  updateProduct?: (product: Product) => void;
}

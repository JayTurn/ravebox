/**
 * DesktopSideStream.interface.tsx
 * Interfaces for the desktop side stream.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { Product } from '../../product/Product.interface';
import {
  RaveStream,
  RaveStreamURLParams
} from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * DesktopSideStream properties.
 */
export interface DesktopSideStreamProps extends RouteComponentProps<RaveStreamURLParams> {
  activeIndex?: number;
  product: Product;
  raveStream?: RaveStream;
  review?: Review;
}

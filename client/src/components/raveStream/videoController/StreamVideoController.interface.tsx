/**
 * StreamVideoController.interface.tsx
 * Interfaces for the video controller.
 */

// Enumerators.
import { SwipeView } from '../swipe/SwipeStream.enum';

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';

/**
 * StreamVideoController properties.
 */
export interface StreamVideoControllerProps {
  activeIndex?: number;
  displayChange: (view: SwipeView) => void;
  product?: Product;
  raveStream?: RaveStream;
  showing: SwipeView;
  updateActiveIndex?: (index: number) => void;
  updateProduct?: (product: Product) => void;
}

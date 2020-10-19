/**
 * StreamVideoController.interface.tsx
 * Interfaces for the video controller.
 */

// Enumerators.
import { SwipeView } from '../swipe/SwipeStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * StreamVideoController properties.
 */
export interface StreamVideoControllerProps {
  startingIndex: number;
  reviews: Array<Review>;
  showing: SwipeView;
}

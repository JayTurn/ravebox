/**
 * StreamVideoOverlay.interface.tsx
 * Interfaces for the video overlay.
 */

// Enumerators.
import { SwipeView } from '../swipe/SwipeStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * StreamVideoOverlay properties.
 */
export interface StreamVideoOverlayProps {
  next: () => void;
  previous: () => void;
  review: Review;
  show: boolean;
}

/**
 * StreamVideoOverlay.interface.tsx
 * Interfaces for the video overlay.
 */

// Enumerators.
import { SwipeView } from '../swipe/SwipeStream.enum';

// Interfaces.
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * StreamVideoOverlay properties.
 */
export interface StreamVideoOverlayProps {
  activeIndex?: number;
  down: () => void;
  next: () => void;
  previous: () => void;
  raveStream?: RaveStream;
  review?: Review;
  show: boolean;
  up: () => void;
}

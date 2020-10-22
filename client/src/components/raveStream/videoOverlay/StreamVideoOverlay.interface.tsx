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
  center: () => void;
  down: () => void;
  next: () => void;
  overlayState: SwipeView;
  play: (playState: boolean) => void;
  playing: boolean;
  previous: () => void;
  raveStream?: RaveStream;
  review?: Review;
  show: boolean;
  up: () => void;
}

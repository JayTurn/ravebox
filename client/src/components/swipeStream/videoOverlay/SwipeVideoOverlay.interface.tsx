/**
 * SwipeVideoOverlay.interface.tsx
 * Interfaces for the video overlay.
 */

// Enumerators.
import { SwipeView } from '../SwipeStream.enum';

// Interfaces.
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * SwipeVideoOverlay properties.
 */
export interface SwipeVideoOverlayProps {
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
  showOverlay: () => void;
  hideOverlay: (immediate?: boolean) => void;
  up: () => void;
}

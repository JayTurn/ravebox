/**
 * RaveVideo.interface.tsx
 * Interfaces for the video component.
 */

// Interfaces.
import { RatingAcceptance } from '../review/rate/Rate.interface';
import { Review } from '../review/Review.interface';

/**
 * Video review properties.
 */
export interface RaveVideoProps {
  review: Review;
  generateToken?: (reviewId: string) => (duration: number) => void;
  makeRatingAllowable?: (acceptance: RatingAcceptance) => void;
  xsrf?: string;
}

/**
 * Video progress interface.
 */
export interface VideoProgress {
  played: number,
  playedSeconds: number,
  loaded: number,
  loadedSeconds: number
}

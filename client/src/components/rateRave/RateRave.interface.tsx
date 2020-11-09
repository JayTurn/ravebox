/**
 * RateRave.interface.tsx
 * Interfaces for rating raves within streams.
 */

// Interfaces.
import { RatingAcceptance } from '../review/rate/Rate.interface';
import { Review } from '../review/Review.interface';
import { VideoProgress } from '../raveVideo/RaveVideo.interface';

/**
 * RateRave properties.
 */
export interface RateRaveProps {
  color?: 'white' | 'default';
  review: Review;
  videoProgress?: VideoProgress;
}

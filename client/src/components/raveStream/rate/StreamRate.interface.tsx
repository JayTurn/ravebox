/**
 * StreamRate.interface.tsx
 * Interfaces for rating raves within streams.
 */

// Interfaces.
import { RatingAcceptance } from '../../review/rate/Rate.interface';
import { Review } from '../../review/Review.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

/**
 * StreamRate properties.
 */
export interface StreamRateProps {
  review: Review;
  videoProgress?: VideoProgress;
}

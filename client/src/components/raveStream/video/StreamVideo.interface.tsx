/**
 * StreamVideo.interface.tsx
 * Interfaces for the rave stream video.
 */

// Enumerators.
import {
  SwipeView,
  VideoPosition
} from '../Swipe/SwipeStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * StreamVideo properties.
 */
export interface StreamVideoProps {
  review: Review;
  positioning: VideoPosition; 
}

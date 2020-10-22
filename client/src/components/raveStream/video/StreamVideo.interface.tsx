/**
 * StreamVideo.interface.tsx
 * Interfaces for the rave stream video.
 */

// Enumerators.
import {
  SwipeView,
  VideoPosition
} from '../swipe/SwipeStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

/**
 * StreamVideo properties.
 */
export interface StreamVideoProps {
  active: boolean;
  muted?: boolean;
  playing: boolean;
  positioning: VideoPosition; 
  review: Review;
  update?: (videoProgress: VideoProgress) => void;
  videoProgress?: VideoProgress;
}

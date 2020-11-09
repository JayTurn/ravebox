/**
 * SwipeVideo.interface.tsx
 * Interfaces for the rave stream video.
 */

// Enumerators.
import {
  SwipeView,
  VideoPosition
} from '../SwipeStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

/**
 * SwipeVideo properties.
 */
export interface SwipeVideoProps {
  active: boolean;
  activeIndex: number;
  index: number;
  muted?: boolean;
  playing: boolean;
  positioning: VideoPosition; 
  review: Review;
  update?: (videoProgress: VideoProgress) => void;
  videoProgress?: VideoProgress;
  nextVideo: () => void;
}

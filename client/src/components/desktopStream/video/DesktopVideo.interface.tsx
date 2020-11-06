/**
 * DesktopVideo.interface.tsx
 * Interfaces for the rave stream video.
 */

// Interfaces.
import { Review } from '../../review/Review.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

/**
 * DesktopVideo properties.
 */
export interface DesktopVideoProps {
  muted?: boolean;
  playing: boolean;
  review: Review;
  update?: (videoProgress: VideoProgress) => void;
  videoProgress?: VideoProgress;
}

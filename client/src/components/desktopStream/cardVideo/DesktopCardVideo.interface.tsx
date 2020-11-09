/**
 * DesktopCardVideo.interface.tsx
 * Interfaces for the rave stream video.
 */

// Interfaces.
import { Review } from '../../review/Review.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

/**
 * DesktopCardVideo properties.
 */
export interface DesktopCardVideoProps {
  activeId?: string;
  muted?: boolean;
  review: Review;
  update?: (videoProgress: VideoProgress) => void;
  updateActive?: (id: string) => void;
  videoProgress?: VideoProgress;
}

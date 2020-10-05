/**
 * EditReviewForm.interface.tsx
 * Interfaces for review creation form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { Recommended } from '../recommendation/Recommendation.enum';
import { VideoType } from '../Review.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../../user/User.interface';
import {
  Review,
  ReviewLink
} from '../Review.interface';

/**
 * Edit review form properties.
 */
export interface EditReviewFormProps extends RouteComponentProps {
  profile?: PrivateProfile;
  review?: Review;
  toggleProduct: (visible: boolean) => void;
  xsrf?: string;
}

/**
 * Edit review form response.
 */
export interface EditReviewFormResponse extends APIResponse {
  review: Review;
  presigned: {
    url: string;
    fields: any;
  }
}

/**
 * Review form request.
 */
export interface EditReviewFormRequest {
  description: string;
  endTime: number;
  _id: string;
  links: Array<ReviewLink>;
  recommended: Recommended;
  sponsored: boolean;
  startTime: number;
  thumbnail?: string;
  title: string;
  videoFileType?: string;
  videoSize?: number;
  video?: File;
  videoTitle?: string;
  videoType: VideoType;
  videoURL?: string;
}

/**
 * Metadata file upload response.
 */
export interface ReviewMetadataResponse {
  message: string;
}

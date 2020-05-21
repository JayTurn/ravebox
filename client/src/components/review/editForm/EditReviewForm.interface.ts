/**
 * EditReviewForm.interface.tsx
 * Interfaces for review creation form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { Recommended } from '../recommendation/Recommendation.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import {
  Review,
  ReviewLink
} from '../Review.interface';

/**
 * Edit review form properties.
 */
export interface EditReviewFormProps extends RouteComponentProps {
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
  _id: string;
  links: Array<ReviewLink>;
  recommended: Recommended;
  sponsored: boolean;
  title: string;
  videoSize?: number;
  videoTitle?: string;
  videoType?: string;
  video?: File;
}

/**
 * Metadata file upload response.
 */
export interface ReviewMetadataResponse {
  message: string;
}

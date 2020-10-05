/**
 * AddReviewForm.interface.tsx
 * Interfaces for review creation form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { Recommended } from '../recommendation/Recommendation.enum';
import {
  VideoType
} from '../Review.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../../user/User.interface';
import { Product } from '../../product/Product.interface';
import {
  Review,
  ReviewLink
} from '../Review.interface';

/**
 * Add review form properties.
 */
export interface AddReviewFormProps extends RouteComponentProps {
  product: Product;
  profile?: PrivateProfile;
  review?: Review;
  toggleProduct: (visible: boolean) => void;
  xsrf?: string;
}

/**
 * Add review form response.
 */
export interface AddReviewFormResponse extends APIResponse {
  review: Review;
  presigned: {
    url: string;
    fields: any;
  }
}

/**
 * Review form request.
 */
export interface AddReviewFormRequest {
  description: string;
  endTime: number;
  links: Array<ReviewLink>;
  _id?: string;
  product: string;
  recommended: Recommended;
  startTime: number;
  sponsored: boolean;
  title: string;
  video?: File;
  videoType: VideoType;
  videoURL?: string;
}

/**
 * Metadata file upload response.
 */
export interface AddReviewMetadataResponse {
  message: string;
}

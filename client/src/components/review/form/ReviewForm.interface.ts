/**
 * AddReviewForm.interface.tsx
 * Interfaces for review creation form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { Recommended } from '../recommendation/Recommendation.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Review } from '../Review.interface';

/**
 * Add review form properties.
 */
export interface ReviewFormProps extends RouteComponentProps {
  productId: string | undefined;
  xsrf?: string;
}

/**
 * Add review form response.
 */
export interface ReviewFormResponse extends APIResponse {
  review: Review;
  presigned: {
    url: string;
    fields: any;
  }
}

/**
 * Review form request.
 */
export interface ReviewFormRequest {
  _id: string;
  product: string;
  title: string;
  recommended: Recommended;
  video: File;
}

/**
 * Metadata file upload response.
 */
export interface ReviewMetadataResponse {
  message: string;
}

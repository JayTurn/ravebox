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
export interface AddReviewFormProps extends RouteComponentProps {
  productId: string | undefined;
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
  _id: string;
  product: string;
  title: string;
  recommended: Recommended;
  video: File;
}

/**
 * Metadata file upload response.
 */
export interface AddReviewMetadataResponse {
  message: string;
}

/**
 * PrivateReviews.interface.tsx
 * Component to display a list of reviews owned by the authenticated user.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateReview } from '../../review/Review.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Private reviews properties.
 */
export interface PrivateReviewsProps {
  reviews: Array<PrivateReview>;
}

/**
 * Parameters for retrieving private reviews.
 */
export interface RetrievePrivateReviewsParams {
  reviews?: Array<PrivateReview>;
  setReviews?: (reviews: Array<PrivateReview>) => void;
  xsrf?: string;
}

/**
 * Interface for the private reviews response.
 */
export interface PrivateReviewsResponse extends APIResponse {
  reviews: Array<PrivateReview>;
}

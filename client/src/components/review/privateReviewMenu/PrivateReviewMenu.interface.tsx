/**
 * PrivateReviewMenu.interface.tsx
 * Menu interfaces for the private review card.
 */

// Import the dependent modules.
import { APIResponse } from '../../../utils/api/Api.interface';
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PrivateReview } from '../Review.interface';

/**
 * Profile menu properties.
 */
export interface PrivateReviewMenuProps extends RouteComponentProps {
  paths: PrivateReviewMenuLinks;
  productTitle: string;
  reviewId: string;
  xsrf?: string;
  reviews?: Array<PrivateReview>;
  setReviews?: (reviews: Array<PrivateReview>) => void;
}

/**
 * Menu item data.
 */
export interface PrivateReviewMenuLinks {
  edit: string;
}

/**
 * Interface for removing the review.
 */
export interface RemoveReviewResponse extends APIResponse {
  message: string;
}

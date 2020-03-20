/**
 * AddReviewForm.interface.tsx
 * Interfaces for review creation form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

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
}

/**
 * MyReviews.interface.tsx
 * Interfaces for the user's reviews.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PrivateReview } from '../../../components/review/Review.interface';

/**
 * Properties for the user's reviews.
 */
export interface MyReviewsProps extends RouteComponentProps {
  reviews?: Array<PrivateReview>;
  setReviews?: (reviews: Array<PrivateReview>) => void;
  xsrf?: string;
}

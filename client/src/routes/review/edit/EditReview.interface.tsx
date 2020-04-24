/**
 * EditReview.interface.tsx
 * Interfaces for the add review screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  RetrieveReviewByIdParams,
  Review
} from '../../../components/review/Review.interface';

/**
 * EditReview properties.
 */
export interface EditReviewProps extends RouteComponentProps<RetrieveReviewByIdParams> {
  review?: Review;
  updateActive?: (review: Review) => void;
  xsrf?: string;
}

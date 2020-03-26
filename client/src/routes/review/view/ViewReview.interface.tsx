/**
 * ViewReview.interface.tsx
 * Interfaces for the view review screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  Review,
  RetrieveReviewByURLParams
} from '../../../components/review/Review.interface';

/**
 * ViewReview properties.
 */
export interface ViewReviewProps extends RouteComponentProps<RetrieveReviewByURLParams> {
  review?: Review;
  updateActive?: (review: Review) => void;
}

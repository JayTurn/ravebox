/**
 * ReviewList.interface.tsx
 * Interfaces for lists of raves.
 */

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import {
  PrivateReview,
  Review
} from '../Review.interface';

/**
 * Review list properties.
 */
export interface ReviewListProps {
  retrievalStatus: RetrievalStatus;
  reviews: Array<PrivateReview> | Array<Review>;
}

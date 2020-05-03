/**
 * ReviewList.interface.tsx
 * Interfaces for lists of raves.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

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
export interface ReviewListProps extends RouteComponentProps {
  singleColumn?: boolean;
  retrievalStatus: RetrievalStatus;
  reviews: Array<PrivateReview> | Array<Review>;
}

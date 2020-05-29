/**
 * ReviewList.interface.tsx
 * Interfaces for lists of raves.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { ScreenContext } from '../Review.enum';

// Interfaces.
import {
  PrivateReview,
  Review
} from '../Review.interface';

/**
 * Review list properties.
 */
export interface ReviewListProps extends RouteComponentProps {
  context: ScreenContext;
  singleColumn?: boolean;
  retrievalStatus: RetrievalStatus;
  reviews: Array<PrivateReview> | Array<Review>;
}

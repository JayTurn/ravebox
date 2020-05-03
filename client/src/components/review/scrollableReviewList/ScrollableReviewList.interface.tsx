/**
 * ScrollableReviewList.interface.tsx
 * Interfaces for scrollable lists of reviews.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import {
  ReviewListType
} from '../listByQuery/ListByQuery.enum';
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import {
  Review
} from '../Review.interface';

/**
 * Scrollable review list properties.
 */
export interface ScrollableReviewListProps extends RouteComponentProps {
  listType: ReviewListType;
  retrievalStatus: RetrievalStatus;
  reviews: Array<Review>;
  title?: React.ReactElement;
}

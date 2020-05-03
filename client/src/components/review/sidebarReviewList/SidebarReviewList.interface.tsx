/**
 * SidebarReviewList.interface.tsx
 * Interfaces for lists of reviews displayed in the sidebar.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
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
 * Sidebar review list properties.
 */
export interface SidebarReviewListProps extends RouteComponentProps {
  listType: ReviewListType;
  retrievalStatus: RetrievalStatus;
  reviews: Array<Review>;
  title?: React.ReactElement;
}

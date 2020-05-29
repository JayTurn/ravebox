/**
 * SidebarReviewList.interface.tsx
 * Interfaces for lists of reviews displayed in the sidebar.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import {
  ReviewListType
} from '../listByQuery/ListByQuery.enum';
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { ScreenContext } from '../Review.enum';

// Interfaces.
import {
  Review
} from '../Review.interface';

/**
 * Sidebar review list properties.
 */
export interface SidebarReviewListProps extends RouteComponentProps {
  context: ScreenContext;
  listType: ReviewListType;
  retrievalStatus: RetrievalStatus;
  reviews: Array<Review>;
  title?: React.ReactElement;
}

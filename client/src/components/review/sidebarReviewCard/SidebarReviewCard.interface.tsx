/**
 * SidebarReviewCard.interface.tsx
 * Component to display a review in sidebar card format.
 */

// Enumerators.
import { ReviewListType } from '../listByQuery/ListByQuery.enum';
import { ScreenContext } from '../Review.enum';

// Interfaces.
import { Review } from '../Review.interface';

/**
 * The sidebar review card properties.
 */
export interface SidebarReviewCardProps extends Review {
  context: ScreenContext;
  listType: ReviewListType;
}

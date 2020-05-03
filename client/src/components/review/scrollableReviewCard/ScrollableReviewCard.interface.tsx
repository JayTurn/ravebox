/**
 * ScrollableReviewCard.interface.tsx
 * Component to display a review in a scrollable list format.
 */

// Enumerators.
import { ReviewListType } from '../listByQuery/ListByQuery.enum';

// Interfaces.
import { Review } from '../Review.interface';

/**
 * The scrollable review card properties.
 */
export interface ScrollableReviewCardProps extends Review {
  listType: ReviewListType;
}

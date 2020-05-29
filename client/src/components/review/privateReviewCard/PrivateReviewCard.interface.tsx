/**
 * PrivateReviewCard.interface.tsx
 * Component to display private review in card format.
 */

// Interfaces.
import { PrivateReview } from '../Review.interface';
import { ScreenContext } from '../Review.enum';

/**
 * The private review card properties.
 */
export interface PrivateReviewCardProps extends PrivateReview {
  context: ScreenContext;
}

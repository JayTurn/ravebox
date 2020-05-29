/**
 * ReviewCard.interface.tsx
 * Component to display a review in card format.
 */

// Interfaces.
import { Review } from '../Review.interface';
import { ScreenContext } from '../Review.enum';

/**
 * The review card properties.
 */
export interface ReviewCardProps extends Review {
  context: ScreenContext;
}

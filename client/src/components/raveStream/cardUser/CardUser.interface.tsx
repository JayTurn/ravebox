/**
 * CardUser.interface.tsx
 * Interface for user information displayed in cards.
 */

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * Card user properties.
 */
export interface CardUserProps {
  review: Review;
}

/**
 * Review.interface.tsx
 * Interfaces for the reviews.
 */

// Enumerators.
import { Recommended } from './recommendation/Recommendation.enum';

/**
 * Review interface.
 */
export interface Review {
  _id: string;
  product: string;
  user?: string;
  title: string;
  recommended: Recommended;
  videoURL?: string;
}

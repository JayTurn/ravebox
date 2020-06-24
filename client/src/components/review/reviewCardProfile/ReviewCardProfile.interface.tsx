/**
 * ReviewCardProfile.interface.tsx
 * Interfaces for the review card profile.
 */

// Enumerators.
import { ScreenContext } from '../Review.enum';

// Interfaces.
import { PublicProfile } from '../../user/User.interface';
import { Review } from '../Review.interface';

/**
 * Review card profile properties.
 */
export interface ReviewCardProfileProps {
  context: ScreenContext;
  review: Review;
  user: PublicProfile;
  url: string;
}

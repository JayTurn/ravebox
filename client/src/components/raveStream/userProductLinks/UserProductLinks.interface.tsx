/**
 * UserProductLinks.interface.tsx
 * Interfaces for the user's product links.
 */

// Interface.
import { PublicProfile } from '../../user/User.interface';
import { ReviewLink } from '../../review/Review.interface';

/**
 * Properties for the user's product links.
 */
export interface UserProductLinksProps {
  user?: PublicProfile;
  reviewLinks?: Array<ReviewLink>;
}

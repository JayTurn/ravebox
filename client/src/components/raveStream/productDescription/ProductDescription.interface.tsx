/**
 * ProductDescription.interface.tsx
 * Interfaces for the product description.
 */

// Interface.
import { PublicProfile } from '../../user/User.interface';
import { ReviewLink } from '../../review/Review.interface';

/**
 * Properties for the product description.
 */
export interface ProductDescriptionProps {
  description?: string;
  user?: PublicProfile;
  reviewLinks?: Array<ReviewLink>;
}

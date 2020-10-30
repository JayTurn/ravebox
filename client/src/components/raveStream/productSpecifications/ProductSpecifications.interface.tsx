/**
 * ProductSpecifications.interface.tsx
 * Interfaces for the product specifications.
 */

// Interface.
import { PublicProfile } from '../../user/User.interface';
import { ReviewLink } from '../../review/Review.interface';

/**
 * Properties for the product specifications.
 */
export interface ProductSpecificationsProps {
  description?: string;
  website?: string;
}

/**
 * Discover.interface
 * Interfaces for the Discover component.
 */

// Interfaces.
import { ReviewGroup } from '../../components/review/Review.interface';

/**
 * Discover properties.
 */
export interface DiscoverProps {
  categoryGroup?: ReviewGroup;
  updateListByCategory?: (reviews: ReviewGroup) => void;
}

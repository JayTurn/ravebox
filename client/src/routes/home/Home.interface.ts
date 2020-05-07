/**
 * Home.interface
 * Interfaces for the Home component.
 */

// Interfaces.
import { ReviewGroup } from '../../components/review/Review.interface';

/**
 * Home properties.
 */
export interface HomeProps {
  categoryGroup?: ReviewGroup;
  updateListByCategory?: (reviews: ReviewGroup) => void;
}

/**
 * Discover.interface
 * Interfaces for the Discover component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { ReviewGroup } from '../../components/review/Review.interface';

/**
 * Discover properties.
 */
export interface DiscoverProps extends RouteComponentProps {
  categoryGroup?: ReviewGroup;
  updateListByCategory?: (reviews: ReviewGroup) => void;
}

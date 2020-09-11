/**
 * Home.interface
 * Interfaces for the Home component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { ReviewGroup } from '../../components/review/Review.interface';

/**
 * Home properties.
 */
export interface HomeProps extends RouteComponentProps {
  categoryGroup?: ReviewGroup;
  updateListByCategory?: (reviews: ReviewGroup) => void;
}

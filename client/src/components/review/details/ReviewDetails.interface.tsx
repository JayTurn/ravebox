/**
 * ReviewDetails.interface.tsx
 * Interfaces for the review details screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  Review,
  ReviewGroup
} from '../Review.interface';

/**
 * Review details properties.
 */
export interface ReviewDetailsProps extends RouteComponentProps {
  review?: Review;
  productGroup?: ReviewGroup;
  updateListByProduct?: (reviews: ReviewGroup) => void;
  xsrf?: string;
}

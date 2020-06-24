/**
 * ShareButton.interface.tsx
 * Interfaces for the share button.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { Review } from '../review/Review.interface';

/**
 * Share component properties interface.
 */
export interface ShareButtonProps extends RouteComponentProps {
  title: string;
  description?: string;
  image?: string;
  review: Review;
}

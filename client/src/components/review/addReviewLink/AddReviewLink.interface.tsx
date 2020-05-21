/**
 * AddReviewLink.interface.tsx
 * Interfaces for adding review links.
 */

// Interfaces.
import { ReviewLink } from '../Review.interface';

/**
 * Add review link component properties.
 */
export interface AddReviewLinkProps {
  index: number;
  link: ReviewLink;
  update: (link: ReviewLink) => (index: number) => void;
}

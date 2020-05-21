/**
 * ReviewLinks.interface.tsx
 * Interfaces for the list of review links component.
 */

// Interfaces.
import { ReviewLink } from '../Review.interface';

/**
 * Review links component properties.
 */
export interface ReviewLinksProps {
  handle: string;
  links: Array<ReviewLink>;
}

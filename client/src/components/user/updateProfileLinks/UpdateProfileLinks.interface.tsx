/**
 * UpdateProfileLinks.interface.tsx
 * Interfaces for the changing the users profile links.
 */

// Interfaces.
import {
  UserLink
} from '../User.interface';

/**
 * Update profile links properties.
 */
export interface UpdateProfileLinksProps {
  links: Array<UserLink>;
  update: (links: Array<UserLink>) => void;
  submit: () => Promise<void>;
}

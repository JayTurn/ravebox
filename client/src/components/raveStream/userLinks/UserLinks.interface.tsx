/**
 * UserLinks.interface.tsx
 * Interfaces for the user's link information.
 */

// Interfaces.
import { PublicProfile } from '../../user/User.interface';

/**
 * Properties for the user's link information.
 */
export interface UserLinksProps {
  user: PublicProfile;
  updateHeight: (value: number) => void;
}

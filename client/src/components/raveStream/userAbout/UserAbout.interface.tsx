/**
 * UserAbout.interface.tsx
 * Interfaces for the user's about information.
 */

// Interfaces.
import { PublicProfile } from '../../user/User.interface';

/**
 * Properties for the user's about information.
 */
export interface UserAboutProps {
  user: PublicProfile;
  updateHeight: (value: number) => void;
}

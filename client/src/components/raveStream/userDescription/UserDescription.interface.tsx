/**
 * UserDescription.interface.tsx
 * Interfaces for the user description.
 */

// Interface.
import { PublicProfile } from '../../user/User.interface';

/**
 * Properties for the user description.
 */
export interface UserDescriptionProps {
  user: PublicProfile;
  updateHeight: () => void;
}

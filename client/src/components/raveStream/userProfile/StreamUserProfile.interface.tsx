/**
 * StreamUserProfile.interface.tsx
 * Interfaces for the user profile displayed in a stream.
 */

// Interfaces.
import { PublicProfile } from '../../user/User.interface';

/**
 * Stream user profile properties.
 */
export interface StreamUserProfileProps {
  user: PublicProfile;
  variant: 'side' | 'small' | 'large';
  showFollow: boolean;
}

/**
 * FollowButton.interface.tsx
 * Follow button to be displayed across various screens.
 */

// Enumerators.
import { FollowType } from '../FollowType.enum';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';

/**
 * Properties for the follow button component.
 */
export interface FollowButtonProps {
  id: string;
  followType: FollowType;
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => void;
}

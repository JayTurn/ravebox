/**
 * FollowButton.interface.tsx
 * Follow button to be displayed across various screens.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { FollowType } from '../FollowType.enum';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';

/**
 * Properties for the follow button component.
 */
export interface FollowButtonProps extends RouteComponentProps {
  id: string;
  handle: string;
  followType: FollowType;
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => void;
}

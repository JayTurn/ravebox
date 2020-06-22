/**
 * Follow.interface.tsx
 * Interfaces for the follow elements.
 */

// Enumerators.
import { FollowType } from './FollowType.enum';

// Interfaces.
import { APIResponse } from '../../utils/api/Api.interface';
import { PrivateProfile } from '../user/User.interface';

/**
 * Following interface.
 */
export interface Following {
  channels: Array<string>;
}

/**
 * Parameters used with the useFollow hook.
 */
export interface FollowParams {
  id: string;
  followType: FollowType;
  profile?: PrivateProfile;
  updateProfile?: (profile: PrivateProfile) => void;
}

/**
 * Follow api response interface.
 */
export interface FollowResponse extends APIResponse {
  following: Following;
}

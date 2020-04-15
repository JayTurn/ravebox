/**
 * ChangeProfile.interface.tsx
 * Interfaces for the change profile details form.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Change profile properties.
 */
export interface ChangeProfileProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => void;
  xsrf?: string;
}

/**
 * Interface for the profile update response.
 */
export interface ChangeProfileResponse extends APIResponse {
  user: PrivateProfile;
}

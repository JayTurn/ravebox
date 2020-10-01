/**
 * Profile.interface.tsx
 * Interfaces for the user profile.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

export interface RetrieveProfileParams {
  admin: boolean;
  profile?: PrivateProfile;
  updateProfile?: (profile: PrivateProfile) => {};
  logout?: () => void;
  updateXsrf?: (token: string) => {};
}

export interface ProfileResponse extends APIResponse {
  user: PrivateProfile;
}

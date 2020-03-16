/**
 * Profile.interface.tsx
 * Interfaces for the user profile.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

export interface RetrieveProfileParams {
  profile?: PrivateProfile;
  updateProfile?: (profile: PrivateProfile) => {};
}

export interface ProfileResponse extends APIResponse {
  user: PrivateProfile;
}

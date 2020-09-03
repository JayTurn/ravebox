/**
 * ProfileSettings.interface.tsx
 * User Profile settings.
 */

// Interfaces.
import { APIResponse } from '../../../../utils/api/Api.interface';
import { PrivateProfile } from '../../User.interface';

/**
 * ProfileSettings properties.
 */
export interface ProfileSettingsProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => {};
}

/**
 * Settings form response values.
 */
export interface SettingsFormResponse extends APIResponse {
  user: PrivateProfile;
}

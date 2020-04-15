/**
 * Settings.interface.tsx
 * User settings.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Settings properties.
 */
export interface SettingsProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => {};
}

/**
 * Settings form response values.
 */
export interface SettingsFormResponse extends APIResponse {
  user: PrivateProfile;
}

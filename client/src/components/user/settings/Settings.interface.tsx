/**
 * Settings.interface.tsx
 * User settings.
 */


// Enumerators.
import { SettingsScreen } from './Settings.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';


/**
 * Settings properties.
 */
export interface SettingsProps {
  profile?: PrivateProfile;
  selected: SettingsScreen;
  update?: (profile: PrivateProfile) => {};
}

/**
 * Settings form response values.
 */
export interface SettingsFormResponse extends APIResponse {
  user: PrivateProfile;
}

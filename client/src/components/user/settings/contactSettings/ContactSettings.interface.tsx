/**
 * ContactSettings.interface.tsx
 * User Contact settings.
 */

// Interfaces.
import { APIResponse } from '../../../../utils/api/Api.interface';
import { PrivateProfile } from '../../User.interface';

/**
 * ContactSettings properties.
 */
export interface ContactSettingsProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => {};
}

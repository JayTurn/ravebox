/**
 * SecuritySettings.interface.tsx
 * User Security settings.
 */

// Interfaces.
import { APIResponse } from '../../../../utils/api/Api.interface';
import { PrivateProfile } from '../../User.interface';

/**
 * SecuritySettings properties.
 */
export interface SecuritySettingsProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => {};
}

/**
 * ChangeEmail.interface.tsx
 * Interfaces for the change email component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Change email component properties.
 */
export interface ChangeEmailProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => void;
  xsrf?: string;
}

/**
 * Interface for the email update response.
 */
export interface ChangeEmailResponse extends APIResponse {
  user: PrivateProfile;
}

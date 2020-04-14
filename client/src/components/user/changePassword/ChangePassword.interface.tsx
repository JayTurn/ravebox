/**
 * ChangePassword.interface.tsx
 * Interfaces for the change password component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Change password component properties.
 */
export interface ChangePasswordProps {
  profile?: PrivateProfile;
  update?: (profile: PrivateProfile) => void;
  xsrf?: string;
}

/**
 * Interface for the password update response.
 */
export interface ChangePasswordResponse extends APIResponse {
  user: PrivateProfile;
}

/**
 * Interface for verifying the current password.
 */
export interface VerifyPasswordResponse extends APIResponse {
  verified: boolean;
}

/**
 * Password settings.
 */
export interface PasswordSettings {
  allowed: boolean;
  oldPassword: string;
  password: string;
}

/**
 * CreateUser.interface.tsx
 * Interfaces for creating a new user.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Properties for the create user interface.
 */
export interface CreateUserProps {
  profile?: PrivateProfile;
  update: (user: PrivateProfile) => void;
  xsrf?: string;
}

/**
 * Interface for the user creation api response.
 */
export interface CreateUserFormResponse extends APIResponse {
  user: PrivateProfile;
}

/**
 * UserLogin.interface.tsx
 * Interfaces for user login components.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PrivateProfile } from '../User.interface';
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * User login properties.
 */
export interface UserLoginProps extends RouteComponentProps {
  addXsrf?: (token: string) => {};
  login?: (user: PrivateProfile) => {};
}

/**
 * User login state.
 */
export interface UserLoginState { 
}

/**
 * Authentication token interface.
 */
export interface AuthenticationToken {
  success: boolean;
  expires_at: string;
  request_token: string;
  error?: Error;
}

/**
 * Login response.
 */
export interface LoginResponse extends APIResponse {
  user: PrivateProfile;
}

/**
 * LoginForm.interface.tsx
 * Interfaces for user login form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PrivateProfile } from '../User.interface';
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * Login form properties.
 */
export interface LoginFormProps extends RouteComponentProps {
  addXsrf?: (token: string) => {};
  login?: (user: PrivateProfile) => {};
}

/**
 * Login form state.
 */
export interface LoginFormState { 
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
 * Login form response.
 */
export interface LoginFormResponse extends APIResponse {
  user: PrivateProfile;
}

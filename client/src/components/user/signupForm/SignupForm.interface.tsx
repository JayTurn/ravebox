/**
 * Signup.interface.tsx
 * Interfaces for the signup form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Interface for the signup form.
 */
export interface SignupFormProps extends RouteComponentProps {
  addXsrf?: (token: string) => {};
  login?: (user: PrivateProfile) => {};
}

/**
 * Interface for the signup api response.
 */
export interface SignupFormResponse extends APIResponse {
  user: PrivateProfile;
}

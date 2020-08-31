/**
 * InvitationRequestForm.interface.tsx
 * Interfaces for the invitation request form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
//import { PrivateProfile } from '../User.interface';
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * Invitation request form properties.
 */
export interface InvitationRequestFormProps extends RouteComponentProps {
  email?: string;
  existingChannel?: string;
}

/**
 * Login form state.
 */
//export interface LoginFormState { 
//}

/**
 * Authentication token interface.
 */
//export interface AuthenticationToken {
  //success: boolean;
  //expires_at: string;
  //request_token: string;
  //error?: Error;
//}

/**
 * Invitation request form response.
 */
export interface InvitationRequestFormResponse extends APIResponse {
  //invitation: PrivateProfile;
}

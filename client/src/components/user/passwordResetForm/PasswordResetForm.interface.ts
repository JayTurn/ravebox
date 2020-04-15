/**
 * PasswordResetForm.interface.tsx
 * Interfaces for the password reset form.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * PasswordReset form properties.
 */
export interface PasswordResetFormProps {
  token: string;
}

/**
 * PasswordReset form state.
 */
export interface PasswordResetFormState { }

/**
 * PasswordReset form response.
 */
export interface PasswordResetFormResponse extends APIResponse {
  sent: boolean;
}

/**
 * ForgotPasswordForm.interface.tsx
 * Interfaces for the password reset form.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * ForgotPassword form properties.
 */
export interface ForgotPasswordFormProps { }

/**
 * ForgotPassword form state.
 */
export interface ForgotPasswordFormState { }

/**
 * ForgotPassword form response.
 */
export interface ForgotPasswordFormResponse extends APIResponse {
  sent: boolean;
}

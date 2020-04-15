/**
 * PasswordReset.interface
 * Interfaces for the password reset component.
 */
'use strict';

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { ResetTokenStatus } from './PasswordReset.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * Verification route params.
 */
export interface ResetToken {
  token: string;
}

/**
 * PasswordReset properties.
 */
export interface PasswordResetProps extends RouteComponentProps<ResetToken> {
  allowed?: ResetTokenStatus;
  reset?: (allowed: ResetTokenStatus) => void;
}

/**
 * Token response.
 */
export interface TokenResponse extends APIResponse {
  allowed: ResetTokenStatus;
}

/**
 * Password reset response.
 */
export interface PasswordResetResponse extends APIResponse {
  reset: boolean;
}

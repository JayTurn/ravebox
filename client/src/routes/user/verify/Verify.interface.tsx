/**
 * Verify.interface
 * Interfaces for the email verification route.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { VerificationStatus } from './Verify.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * Verification route params.
 */
export interface VerificationToken {
  token: string;
}

/**
 * Verification properties.
 */
export interface VerifyProps extends RouteComponentProps<VerificationToken> {
  verified?: VerificationStatus;
  verify?: (verified: VerificationStatus) => void;
}

/**
 * Verification response.
 */
export interface VerifyResponse extends APIResponse {
  verified: boolean;
}

/**
 * Verify.interface
 * Interfaces for the email verification route.
 */
'use strict';

// Modules.
import { RouteComponentProps } from 'react-router';

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
}

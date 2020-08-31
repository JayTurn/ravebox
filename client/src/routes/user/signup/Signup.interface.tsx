/**
 * Signup.interface
 * Interfaces for the signup route component.
 */
'use strict';

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Invitation } from '../../../components/invitation/invitation.interface';

/**
 * Signup properties.
 */
export interface SignupProps extends RouteComponentProps<SignupURLParams> {
}

/**
 * Sign up params.
 */
export interface SignupURLParams {
  invitation: string;
}

/**
 * API response for validating the invitation.
 */
export interface ValidateInvitationResponse extends APIResponse {
  invitation: Invitation 
}

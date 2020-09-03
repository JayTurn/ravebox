/**
 * invitation.interface.ts
 * Interface for the invitation details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { InvitationStatus } from './invitation.enum';


/**
 * Mongoose Invitation document.
 */
export interface InvitationDetailsDocument extends Mongoose.Document {
  email: string;
  invitedBy: string;
  existingChannel: number;
  status: InvitationStatus;
}

/**
 * Invitation details.
 */
export interface InvitationDetails {
  email: string;
  invitedBy: string;
  existingChannel: number;
  status: InvitationStatus;
}

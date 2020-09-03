/**
 * Invitation.interface.tsx
 * Interfaces for the invitation.
 */

/**
 * Invitation properties interface.
 */
export interface Invitation {
  _id: string;
  email: string;
  existingChannel?: string;
  invitedBy: string;
}

/**
 * User.interface.tsx
 * Interfaces for user components.
 */

/**
 * Private profile for a user's own account.
 */
export interface PrivateProfile {
  _id: string;
  email: string;
}

/**
 * Public profile for a user's public facing display.
 */
export interface PublicProfile {
  email: string;
}

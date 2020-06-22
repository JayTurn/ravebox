/**
 * User.interface.tsx
 * Interfaces for user components.
 */

// Interfaces.
import { Following } from '../follow/Follow.interface';

/**
 * Private profile for a user's own account.
 */
export interface PrivateProfile {
  _id: string;
  email: string;
  emailVerified: boolean;
  following: Following;  
  handle: string;
}

/**
 * Public profile for a user's public facing display.
 */
export interface PublicProfile {
  _id: string;
  handle: string;
}

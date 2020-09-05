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
  avatar?: string;
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
  avatar?: string;
  handle: string;
  statistics?: ProfileStatistics;
}

/**
 * Interfacts for public profile statistics.
 */
export interface ProfileStatistics {
  followers: number;
  ravesCount: number;
  reviews: Array<ProfileReviewStatistics>;
}

export interface ProfileReviewStatistics {
  review: string;
  watchCount: number;
}

export interface ProfilePresentationStatistics {
  followers: string;
  raves: string;
}

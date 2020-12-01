/**
 * UserRaves.interface.tsx
 * Interfaces for the rave information shown in a stream.
 */

// Interfaces.
import { PublicProfile } from '../../user/User.interface';

/**
 * Properties for the user's raves.
 */
export interface UserRavesProps {
  exclude?: string;
  user: PublicProfile;
  updateHeight: (value: number) => void;
  updateRaveStreamCount?: (count: number) => void; 
}

/**
 * Retrive user rave stream params.
 */
export interface RetrieveUserRaveStreamParams {
  exclude?: string;
  user: PublicProfile;
  updateHeight: () => void;
}

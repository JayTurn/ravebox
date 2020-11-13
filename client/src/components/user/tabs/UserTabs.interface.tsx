/**
 * UserTabs.interface.tsx
 * Interfaces for the product tabs.
 */

// Interfaces.
import { PublicProfile } from '../User.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';

/**
 * UserTabs properties.
 */
export interface UserTabsProps {
  user: PublicProfile;
  raveStreams?: Array<RaveStream>;
}

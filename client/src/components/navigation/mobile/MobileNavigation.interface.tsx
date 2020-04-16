/**
 * MobileNavigation.interface.ts
 * Interfaces for the mobile navigation component.
 */

// Dependent interfaces.
import { PrivateProfile } from '../../user/User.interface';

// Import the dependent modules.
import { RouteComponentProps } from 'react-router';

/**
 * Mobile navigation properties.
 */
export interface MobileNavigationProps  extends RouteComponentProps {
  toggleSide?: (show: boolean) => void;
  profile?: PrivateProfile;
  expanded: boolean;
}

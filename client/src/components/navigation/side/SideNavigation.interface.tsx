/**
 * SideNavigation.interface.ts
 * Interfaces for the side navigation component.
 */

// Dependent interfaces.
import { PrivateProfile } from '../../user/User.interface';

// Import the dependent modules.
import { RouteComponentProps } from 'react-router';

/**
 * Side navigation properties.
 */
export interface SideNavigationProps  extends RouteComponentProps {
  show?: (show: boolean) => void;
  profile?: PrivateProfile;
  expanded: boolean;
}

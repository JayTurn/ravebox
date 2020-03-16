/**
 * Navigation.interface.ts
 * Interfaces for the navigation properties and state.
 */

// Dependent interfaces.
import { PrivateProfile } from '../user/User.interface';

// Import the dependent modules.
import { RouteComponentProps } from 'react-router';

/**
 * Navigation properties.
 */
export interface NavigationProps  extends RouteComponentProps {
  logout?: Function;
  showLogin?: Function;
  removeXsrf?: (token: string) => {};
  profile?: PrivateProfile;
}

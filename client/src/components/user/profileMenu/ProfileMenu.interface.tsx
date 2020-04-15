/**
 * ProfileMenu.interface.tsx
 * Profile menu interfaces.
 */

// Import the dependent modules.
import { RouteComponentProps } from 'react-router';

// Dependent interfaces.
import { PrivateProfile } from '../User.interface';

/**
 * Profile menu properties.
 */
export interface ProfileMenuProps extends RouteComponentProps {
  logout?: Function;
  removeXsrf?: (token: string) => {};
  profile?: PrivateProfile;
}

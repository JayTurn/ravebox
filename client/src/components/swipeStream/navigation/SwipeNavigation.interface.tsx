/**
 * SwipeNavigation.interface.tsx
 * Interface for the stream navigation.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';

/**
 * Stream navigation properties.
 */
export interface SwipeNavigationProps extends RouteComponentProps {
  showLogin?: Function;
  profile?: PrivateProfile;
  sideMenuExpanded?: boolean;
  toggleSide?: (show: boolean) => void;
  title: string;
  variant: 'white' | 'colored';
}

/**
 * Stream navigation scroll properties.
 */
export interface SwipeNavigationScrollProps {
  children: React.ReactElement;
}

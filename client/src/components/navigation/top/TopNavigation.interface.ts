/**
 * TopNavigation.interface.ts
 * Interfaces for the top navigation properties and state.
 */

// Modules.
import * as React from 'react';

// Dependent interfaces.
import { PrivateProfile } from '../../user/User.interface';

// Import the dependent modules.
import { RouteComponentProps } from 'react-router';

/**
 * Top navigation properties.
 */
export interface TopNavigationProps  extends RouteComponentProps {
  showLogin?: Function;
  profile?: PrivateProfile;
  sideMenuExpanded?: boolean;
  toggleSide?: (show: boolean) => void;
}

/**
 * Navigation scroll properties.
 */
export interface NavigationScrollProps {
  children: React.ReactElement;
  isHomeScreen: boolean;
}

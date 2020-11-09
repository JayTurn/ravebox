/**
 * App.interface.ts
 * Interfaces for the main application properties and state.
 */
'use strict';

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PrivateProfile } from '../components/user/User.interface';

/**
 * App properties.
 */
export interface AppProps extends RouteComponentProps {
  expanded?: boolean;
  loading?: boolean;
  login?: (profile: PrivateProfile) => {};
  profile?: PrivateProfile;
  showLogin?: Function;
  updateImageConfiguration?: Function;
  updateLoading?: (loaded: boolean) => void;
  updateXsrf?: (token: string) => {};
}

/**
 * App state.
 */
export interface AppState { }

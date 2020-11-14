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
  backPath?: string;
  expanded?: boolean;
  loading?: boolean;
  login?: (profile: PrivateProfile) => {};
  profile?: PrivateProfile;
  showLogin?: Function;
  updateBackPath?: (path: string) => void;
  updateImageConfiguration?: Function;
  updateLoading?: (loaded: boolean) => void;
  updateXsrf?: (token: string) => {};
}

/**
 * App state.
 */
export interface AppState { }

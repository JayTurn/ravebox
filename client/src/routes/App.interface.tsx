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
  updateImageConfiguration?: Function;
  showLogin?: Function;
  profile?: PrivateProfile;
  login?: (profile: PrivateProfile) => {};
  updateXsrf?: (token: string) => {};
}

/**
 * App state.
 */
export interface AppState { }

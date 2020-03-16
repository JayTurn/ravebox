/**
 * Interfaces for the watchlist store.
 */

// Dependent modules.
import { ActionType } from 'typesafe-actions';

// Dependent models.
import * as actions from './Actions';

// Dependent interfaces.
import { PrivateProfile } from '../../components/user/User.interface';

/**
 * Redux user action type.
 */
export type UserAction = ActionType<typeof actions>;

/**
 * Redux show prompt action type.
 */
export type ShowPromptAction = ActionType<typeof actions>;

/**
 * User store interface.
 */
export interface UserStore {
  profile: PrivateProfile;
  showLogin: boolean;
}

/**
 * Actions.ts
 * User actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { UserVerb } from './Actions.enum';

// Dependent interfaces.
import { PrivateProfile } from '../../components/user/User.interface';

/**
 * Adds a user to the redux store.
 *
 * @param { User } user - the user to be added.
 */
export const login = (profile: PrivateProfile) => action(
  UserVerb.LOGIN, profile);

/**
 * Removes a user from the redux store.
 *
 * @param { User } user - the user to be removed.
 */
export const logout = (profile: PrivateProfile) => action(
  UserVerb.LOGOUT, profile);

/**
 * Shows the login prompt.
 */
export const showLogin = () => action(
  UserVerb.SHOW_LOGIN, true);

/**
 * Hides the login prompt.
 */
export const hideLogin = () => action(
  UserVerb.HIDE_LOGIN, false);

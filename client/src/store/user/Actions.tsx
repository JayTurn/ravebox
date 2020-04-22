/**
 * Actions.ts
 * User actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { UserVerb } from './Actions.enum';
import { VerificationStatus } from '../../routes/user/verify/Verify.enum';
import { ResetTokenStatus } from '../../routes/user/reset/PasswordReset.enum';

// Dependent interfaces.
import { PrivateProfile } from '../../components/user/User.interface';
import { Review } from '../../components/review/Review.interface';

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

/**
 * Updates a user in the redux store.
 *
 * @param { User } user - the user to be updated.
 */
export const update = (profile: PrivateProfile) => action(
  UserVerb.UPDATE, profile);

/**
 * Updates a verification state in the redux store.
 *
 * @param { VerificationStatus } verified - the verification status.
 */
export const verify = (verified: VerificationStatus) => action(
  UserVerb.VERIFY, verified);

/**
 * Updates the active list of user reviews.
 *
 * @param { Array<Review> } reviews - the list of user reviews.
 */
export const setRaves = (raves: Array<Review>) => action(
  UserVerb.SET_RAVES, raves);

/**
 * Updates a password reset state in the redux store.
 *
 * @param { ResetTokenStatus } status - the password reset status.
 */
export const reset = (allowed: ResetTokenStatus) => action(
  UserVerb.RESET, allowed);

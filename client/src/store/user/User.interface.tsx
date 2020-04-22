/**
 * Interfaces for the watchlist store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Enumerators.
import { ResetTokenStatus } from '../../routes/user/reset/PasswordReset.enum';
import { VerificationStatus } from '../../routes/user/verify/Verify.enum';

// Interfaces.
import { PrivateProfile } from '../../components/user/User.interface';
import { Review } from '../../components/review/Review.interface';

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
  raves: Array<Review>;
  reset: ResetTokenStatus;
  showLogin: boolean;
  verified: VerificationStatus;
}

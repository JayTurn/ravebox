/**
 * Reducer.ts
 * Reducer for the user store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { UserVerb } from './Actions.enum';
import { ResetTokenStatus } from '../../routes/user/reset/PasswordReset.enum';
import { VerificationStatus } from '../../routes/user/verify/Verify.enum';

// Dependent interfaces.
import { PrivateProfile } from '../../components/user/User.interface';
import { PrivateReview } from '../../components/review/Review.interface';
import {
  UserStore,
  UserAction,
  ShowPromptAction
} from './User.interface';

/**
 * Combines the user reducers to be loaded with the store.
 */
export default combineReducers<UserStore, UserAction>({

  /**
   * Define the user redux reducer.
   *
   * @param { UserStore } state - the current user.
   * @param { UserAction } action - the filters action.
   *
   * @return APIImageConfig
   */
  profile: (state: PrivateProfile = {
    _id: '', 
    email: '', 
    emailVerified: false,
    following: {
      channels: []
    },
    handle: ''
  }, action: UserAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case UserVerb.LOGIN:
      case UserVerb.UPDATE:
        // Append the new value to the list of watched items.
        return action.payload;
      case UserVerb.LOGOUT:
        // Remove the payload item from the list of watched items.
        return {
          _id: '', 
          email: '', 
          emailVerified: false, 
          following: {
            channels: []
          },
          handle: ''
        };
      default:
        return state;
    }
  },

  /**
   * Define the user reviews redux reducer.
   *
   * @param { Array<PrivateReview> } state - the current user reviews.
   * @param { UserAction } action - the filters action.
   *
   * @return APIImageConfig
   */
  reviews: (state: Array<PrivateReview> = [], action: UserAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case UserVerb.SET_REVIEWS:
        // Update the raves with the provided values.
        return action.payload;
      default:
        return state;
    }
  },

  /**
   * Define the display of the login prompt.
   *
   * @param { boolean } state - the current display state.
   * @param {  } action - the filters action.
   *
   * @return APIImageConfig
   */
  showLogin: (state: boolean = false, action: ShowPromptAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case UserVerb.SHOW_LOGIN:
        // Append the new value to the list of watched items.
        return true;
      case UserVerb.HIDE_LOGIN:
        // Remove the payload item from the list of watched items.
        return false;
      default:
        return state;
    }
  },

  /**
   * Define the verification state.
   *
   * @param { boolean } state - the current verification state.
   * @param {  } action - the filters action.
   *
   * @return APIImageConfig
   */
  verified: (state: VerificationStatus = VerificationStatus.WAITING, action: ShowPromptAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case UserVerb.VERIFY:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return state;
    }
  },

  /**
   * Define the reset token state.
   *
   * @param { ResetTokenStatus } state - the current reset token state.
   * @param {  } action - the filters action.
   *
   * @return APIImageConfig
   */
  reset: (state: ResetTokenStatus = ResetTokenStatus.WAITING, action: ShowPromptAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case UserVerb.RESET:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return state;
    }
  }
});

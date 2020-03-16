/**
 * Reducer.ts
 * Reducer for the user store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { UserVerb } from './Actions.enum';

// Dependent interfaces.
import { PrivateProfile } from '../../components/user/User.interface';
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
  profile: (state: PrivateProfile = {_id: '', email: ''}, action: UserAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case UserVerb.LOGIN:
        // Append the new value to the list of watched items.
        return action.payload;
      case UserVerb.LOGOUT:
        // Remove the payload item from the list of watched items.
        return {_id: '', email: ''};
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
  }
});

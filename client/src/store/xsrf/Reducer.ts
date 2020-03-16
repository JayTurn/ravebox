/**
 * Reducer.ts
 * Reducer for the xsrf store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { XsrfVerb } from './Actions.enum';

// Dependent interfaces.
import {
  XsrfStore,
  XsrfAction
} from './Xsrf.interface';

/**
 * Combines the user reducers to be loaded with the store.
 */
export default combineReducers<XsrfStore, XsrfAction>({

  /**
   * Define the xsrf token reducer.
   *
   * @param { boolean } state - the current display state.
   * @param {  } action - the filters action.
   *
   * @return APIImageConfig
   */
  token: (token: string = '', action: XsrfAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case XsrfVerb.ADD:
        // Append the new value to the list of watched items.
        return action.payload;
      case XsrfVerb.REMOVE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return token;
    }
  }
});

/**
 * Reducer.ts
 * Reducer for the loading store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { LoadingVerb } from './Actions.enum';

// Interfaces.
import {
  LoadingStore,
  LoadingAction
} from './loading.interface';

/**
 * Combines the loading reducers to be set with the store.
 */
export default combineReducers<LoadingStore, LoadingAction>({
  /**
   * Define the loading update reducer.
   *
   * @param { boolean } state - the current loading state.
   * @param { LoadingAction } action - the update action.
   *
   * @return boolean
   */
  loading: (
    state: boolean = false,
    action: LoadingAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case LoadingVerb.UPDATE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return state;
    }
  }
});

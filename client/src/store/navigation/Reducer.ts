/**
 * Reducer.ts
 * Reducer for the navigation store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { NavigationVerb } from './Actions.enum';

// Dependent interfaces.
import {
  NavigationStore,
  NavigationAction
} from './Navigation.interface';

/**
 * Combines the navigation reducers to be loaded with the store.
 */
export default combineReducers<NavigationStore, NavigationAction>({

  /**
   * Define the xsrf token reducer.
   *
   * @param { boolean } state - the current display state.
   * @param {  } action - the filters action.
   *
   * @return APIImageConfig
   */
  display: (display: boolean = false, action: NavigationAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case NavigationVerb.TOGGLE_SIDE:
        // Update the display state of the navigation.
        return action.payload;
      default:
        return display;
    }
  }
});

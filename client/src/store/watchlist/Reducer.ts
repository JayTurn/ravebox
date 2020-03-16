/**
 * Reducer.ts
 * Reducer for the configuration store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { WatchlistVerb } from './Actions.enum';

// Dependent interfaces.
import { TVItem } from '../../components/television/Television.interface';
import {
  WatchlistStore,
  WatchlistAction
} from './Watchlist.interface';

/**
 * Combines the content reducers to be loaded with the store.
 */
export default combineReducers<WatchlistStore, WatchlistAction>({

  /**
   * Define the api image configuration redux reducer.
   *
   * @param { APIImageConfig } state - the .
   * @param { FiltersAction } action - the filters action.
   *
   * @return APIImageConfig
   */
  watching: (state: Array<TVItem> = [], action: WatchlistAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case WatchlistVerb.ADD_ITEM:
        // Append the new value to the list of watched items.
        const added: Array<TVItem> = [...state, action.payload];
        return added;
      case WatchlistVerb.REMOVE_ITEM:
        // Remove the payload item from the list of watched items.
        const removed: Array<TVItem> = state.filter((item: TVItem, index: number) => {
          return item.id !== action.payload.id;
        });
        return removed;
      default:
        return state;
    }
  }
});

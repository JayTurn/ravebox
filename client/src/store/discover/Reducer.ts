/**
 * Reducer.ts
 * Reducer for the review store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { Recommended } from '../../components/review/recommendation/Recommendation.enum';
import { DiscoverVerb } from './Actions.enum';

// Interfaces.
import {
  DiscoverGroup
} from '../../components/discover/Discover.interface';
import {
  DiscoverStore,
  DiscoverAction
} from './discover.interface';

const emptyGroup: DiscoverGroup = {
  category: {
    key: '',
    label: ''
  },
  items: []
};

/**
 * Combines the discover reducers to be loaded with the store.
 */
export default combineReducers<DiscoverStore, DiscoverAction>({
  /**
   * Define the dsicover group reducer.
   *
   * @param { Array<DiscoverGroup> } groups - the current review state.
   * @param { DiscoverAction } action - the discover group list actions.
   *
   * @return Review
   */
  groups: (
    state: Array<DiscoverGroup> = [JSON.parse(JSON.stringify(emptyGroup))],
    action: DiscoverAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case DiscoverVerb.UPDATE_GROUPS:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return state;
    }
  }
});

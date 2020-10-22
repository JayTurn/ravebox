/**
 * Reducer.ts
 * Reducer for the stream store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { RaveStreamVerb } from './Actions.enum';

// Interfaces.
import {
  RaveStream,
} from '../../components/raveStream/RaveStream.interface';
import {
  RaveStreamStore,
  RaveStreamAction
} from './raveStream.interface';

// Utilities.
import { emptyRaveStream } from '../../components/raveStream/RaveStream.common';

const emptyStream: RaveStream = emptyRaveStream(); 

/**
 * Combines the rave stream reducers to be loaded with the store.
 */
export default combineReducers<RaveStreamStore, RaveStreamAction>({
  /**
   * Define the active rave stream reducer.
   *
   * @param { RaveStream } state - the current rave stream.
   * @param { RaveStreamAction } action - the filters action.
   *
   * @return RaveStream
   */
  active: (
    index: number = 0,
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE_ACTIVE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return index;
    }
  },

  /**
   * Define the loaded rave stream reducer.
   *
   * @param { RaveStream } state - the current rave stream.
   * @param { RaveStreamAction } action - the filters action.
   *
   * @return RaveStream
   */
  raveStream: (
    raveStream: RaveStream = JSON.parse(JSON.stringify(emptyStream)),
    action: RaveStreamAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case RaveStreamVerb.UPDATE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return raveStream;
    }
  }
});
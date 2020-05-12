/**
 * Reducer.ts
 * Reducer for the channel store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { ChannelVerb } from './Actions.enum';

// Dependent interfaces.
import { ChannelDetails } from '../../routes/user/channel/Channel.interface';
import {
  ChannelStore,
  ChannelAction
} from './Channel.interface';

/**
 * Combines the channel reducers to be loaded with the store.
 */
export default combineReducers<ChannelStore, ChannelAction>({

  /**
   * Define the channel redux reducer.
   *
   * @param { ChannelStore } state - the current channel store.
   * @param { ChannelAction } action - the channel actions.
   *
   * @return APIImageConfig
   */
  active: (state: ChannelDetails = {}, action: ChannelAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ChannelVerb.UPDATE_ACTIVE:
        // Update the store with the newly provided channel.
        return action.payload;
      default:
        return state;
    }
  }
});

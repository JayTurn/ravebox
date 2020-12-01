/**
 * Reducer.ts
 * Reducer for the video store.
 */

// Modules.
import { combineReducers } from 'redux';

// Enumerators.
import { VideoVerb } from './Actions.enum';

// Interfaces.
import { VideoProgress } from '../../components/raveVideo/RaveVideo.interface';
import {
  VideoStore,
  VideoAction
} from './video.interface';

const emptyVideo: VideoProgress = {
  _id: '',
  loaded: 0,
  loadedSeconds: 0,
  played: 0,
  playedSeconds: 0,
  videoDuration: 0
}; 

/**
 * Combines the video reducers to be loaded with the store.
 */
export default combineReducers<VideoStore, VideoAction>({
  /**
   * Define the active video reducer.
   *
   * @param { string } state - the current active video.
   * @param { VideoAction } action - the update action.
   *
   * @return VideoProgress
   */
  active: (
    id: string = '',
    action: VideoAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case VideoVerb.UPDATE_ACTIVE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return id;
    }
  },

  /**
   * Define the video update reducer.
   *
   * @param { VideoProgress } state - the current video progress.
   * @param { VideoAction } action - the update action.
   *
   * @return VideoProgress
   */
  progress: (
    videoProgress: VideoProgress = JSON.parse(JSON.stringify(emptyVideo)),
    action: VideoAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case VideoVerb.UPDATE:
        // Append the new value to the list of watched items.
        return action.payload;
      default:
        return videoProgress;
    }
  },

  /**
   * Define the muted video state.
   *
   * @param { booleab } state - the current mute state.
   * @param { VideoAction } action - the video action.
   *
   * @return VideoProgress
   */
  muted: (
    state: boolean = false,
    action: VideoAction
  ) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case VideoVerb.MUTE:
        // Update the muted state.
        return action.payload;
      default:
        return state;
    }
  }
});

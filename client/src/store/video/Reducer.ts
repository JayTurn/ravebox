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
  }
});

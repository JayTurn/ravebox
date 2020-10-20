/**
 * Interfaces for the video store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import { VideoProgress } from '../../components/raveVideo/RaveVideo.interface';

/**
 * Redux stream action type.
 */
export type VideoAction = ActionType<typeof actions>;

/**
 * Video store interface.
 */
export interface VideoStore {
  progress: VideoProgress;
}

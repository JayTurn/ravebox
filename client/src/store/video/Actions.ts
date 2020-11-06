/**
 * Actions.ts
 * Video actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { VideoVerb } from './Actions.enum';

// Dependent interfaces.
import { VideoProgress } from '../../components/raveVideo/RaveVideo.interface';

/**
 * Switches the current mute state in the redux store.
 *
 * @param { boolean } muted - the muted state to be updated.
 */
export const mute = (muted: boolean) => action(
  VideoVerb.MUTE, muted);

/**
 * Updates the current video progress in the redux store.
 *
 * @param { VideoProgress }  - the video progress to be updated.
 */
export const update = (progress: VideoProgress) => action(
  VideoVerb.UPDATE, progress);

/**
 * Updates the current active video id in the redux store.
 *
 * @param { string }  - the id to be updated.
 */
export const updateActive = (active: string) => action(
  VideoVerb.UPDATE_ACTIVE, active);


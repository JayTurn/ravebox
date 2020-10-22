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
 * Updates the current video progress in the redux store.
 *
 * @param { VideoProgress }  - the video progress to be updated.
 */
export const update = (progress: VideoProgress) => action(
  VideoVerb.UPDATE, progress);

/**
 * Switches the current mute state in the redux store.
 *
 * @param { boolean } muted - the muted state to be updated.
 */
export const mute = (muted: boolean) => action(
  VideoVerb.MUTE, muted);

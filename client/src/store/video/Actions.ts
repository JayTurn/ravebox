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

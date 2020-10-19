/**
 * Actions.ts
 * Rave stream actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { RaveStreamVerb } from './Actions.enum';

// Dependent interfaces.
import {
  RaveStream
} from '../../components/raveStream/RaveStream.interface';

/**
 * Updates the active stream in the redux store.
 *
 * @param { Stream } raveStream - the rave stream to be made active.
 */
export const updateActive = (raveStream: RaveStream) => action(
  RaveStreamVerb.UPDATE_ACTIVE, raveStream);

/**
 * Interfaces for the rave stream store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import {
  RaveStream,
} from '../../components/raveStream/RaveStream.interface';

/**
 * Redux stream action type.
 */
export type RaveStreamAction = ActionType<typeof actions>;

/**
 * Rave stream store interface.
 */
export interface RaveStreamStore {
  active: RaveStream;
}

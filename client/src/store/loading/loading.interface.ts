/**
 * Interfaces for the loading store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

/**
 * Redux stream action type.
 */
export type LoadingAction = ActionType<typeof actions>;

/**
 * Loading store interface.
 */
export interface LoadingStore {
  loading: boolean;
}

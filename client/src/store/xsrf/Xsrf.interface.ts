/**
 * Interfaces for the xsrf store.
 */

// Dependent modules.
import { ActionType } from 'typesafe-actions';

// Dependent models.
import * as actions from './Actions';

/**
 * Redux user action type.
 */
export type XsrfAction = ActionType<typeof actions>;

/**
 * User store interface.
 */
export interface XsrfStore {
  token: string;
}

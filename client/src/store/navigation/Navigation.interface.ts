/**
 * Interfaces for the navigation store.
 */

// Dependent modules.
import { ActionType } from 'typesafe-actions';

// Dependent models.
import * as actions from './Actions';

/**
 * Redux navigation action type.
 */
export type NavigationAction = ActionType<typeof actions>;

/**
 * Navigation store interface.
 */
export interface NavigationStore {
  display: boolean;
}

/**
 * Interfaces for the discover store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import { DiscoverGroup } from '../../components/discover/Discover.interface';

/**
 * Redux review action type.
 */
export type DiscoverAction = ActionType<typeof actions>;

/**
 * Discover store interface.
 */
export interface DiscoverStore {
  groups: Array<DiscoverGroup>;
}

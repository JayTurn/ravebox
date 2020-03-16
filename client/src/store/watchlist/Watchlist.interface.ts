/**
 * Interfaces for the watchlist store.
 */

// Dependent modules.
import { ActionType } from 'typesafe-actions';

// Dependent models.
import * as actions from './Actions';

// Dependent interfaces.
import { TVItem } from '../../components/television/Television.interface';

/**
 * Redux content action type.
 */
export type WatchlistAction = ActionType<typeof actions>;

/**
 * Content store interface.
 */
export interface WatchlistStore {
  watching: Array<TVItem>;
}


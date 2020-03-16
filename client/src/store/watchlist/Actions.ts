/**
 * Actions.ts
 * Watchlist actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { WatchlistVerb } from './Actions.enum';

// Dependent interfaces.
import { TVItem } from '../../components/television/Television.interface';

/**
 * Adds an item to the watching store.
 *
 * @param { Array<number> } watching - the current list of watched items.
 */
export const addToWatchlist = (item: TVItem) => action(
  WatchlistVerb.ADD_ITEM, item);

/**
 * Removes an item from the watching store.
 *
 * @param { Array<number> } watching - the current list of watched items.
 */
export const removeFromWatchlist = (item: TVItem) => action(
  WatchlistVerb.REMOVE_ITEM, item);

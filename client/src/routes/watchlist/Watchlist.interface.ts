/**
 * Watchlist.interface.ts
 * Interfaces for the watchlist component.
 */

// Dependent interfaces.
import { TVItem } from '../../components/television/Television.interface';

/**
 * Watchlist properties.
 */
export interface WatchlistProps {
  list: Array<TVItem>;
  showLogin: Function;
}

/**
 * Watchlist state.
 */
export interface WatchlistState {
}

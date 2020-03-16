/**
 * Watchlist.interface.tsx
 * Interfaces for the watchlist elements.
 */

// Dependent interfaces.
import { TVItem } from '../television/Television.interface';

/**
 * Watchlist button properties.
 */
export interface WatchlistButtonProps {
  addItem?: Function;
  allowed?: boolean;
  item: TVItem;
  promptLogin?: Function;
  removeItem?: Function;
  watching: boolean;
}

/**
 * Watchlist button state.
 */
export interface WatchlistButtonState {}

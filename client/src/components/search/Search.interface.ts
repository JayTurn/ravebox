/**
 * Search.interface.tsx
 * Properties and state for the search component.
 */

// Dependent interfaces.
import { TVSearch } from '../television/Television.interface';

/**
 * Search properties.
 */
export interface SearchProps { }

/**
 * Search state.
 */
export interface SearchState {
  query: string;
  results?: TVSearch;
}

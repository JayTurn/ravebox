/**
 * search.interface.ts
 * Interfaces for the search results.
 */

// Enumerators.
import { ResultType } from './search.enum';

/**
 * Autocomplete search results interfaces.
 */
export interface AutocompleteResults {
  results: Array<AutocompleteItem>;
}

/**
 * Individual autocomplete result.
 */
export interface AutocompleteItem {
  id: string;
  resultType: ResultType;
  title: string;
  url?: string;
}

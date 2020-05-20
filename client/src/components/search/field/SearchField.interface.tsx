/**
 * SearchField.interface.tsx
 * Interfaces for the search field component.
 */

// Enumerators.
import { ResultType } from '../Search.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * Search field component properties.
 */
export interface SearchFieldProps {
  toggleSearchField?: (e: React.SyntheticEvent) => void;
}

/**
 * Autocomplete search hook params.
 */
export interface AutocompleteSearchParams {
  query: string;
}

/**
 * Response from the autocomplete search.
 */
export interface AutocompleteSearchResponse extends APIResponse {
  results: Array<AutocompleteSearchResult>;
}

/**
 * Autocomplete search result.
 */
export interface AutocompleteSearchResult {
  id: string;
  resultType: ResultType;
  title: string;
  url?: string;
}
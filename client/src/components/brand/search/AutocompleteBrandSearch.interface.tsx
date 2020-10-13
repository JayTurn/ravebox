/**
 * AutocompleteBrandSearch.interface.tsx
 * Interfaces for the autocompltee brand search field component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Brand } from '../Brand.interface';

/**
 * Autocomplete brand search hook params.
 */
export interface AutocompleteBrandSearchParams {
  query: string;
}

/**
 * Response from the autocomplete brand search.
 */
export interface AutocompleteBrandSearchResponse extends APIResponse {
  results: Array<Brand>;
}

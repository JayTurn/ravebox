/**
 * AutocompleteProductSearch.interface.tsx
 * Interfaces for the autocompltee product search field component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../Product.interface';

/**
 * Autocomplete product search hook params.
 */
export interface AutocompleteProductSearchParams {
  query: string;
}

/**
 * Response from the autocomplete product search.
 */
export interface AutocompleteProductSearchResponse extends APIResponse {
  results: Array<Product>;
}

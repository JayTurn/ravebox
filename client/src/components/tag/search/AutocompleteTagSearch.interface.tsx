/**
 * AutocompleteTagSearch.interface.tsx
 * Interfaces for the autocompltee brand search field component.
 */

// Enumerators.
import { TagAssociation } from '../Tag.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Tag } from '../Tag.interface';

/**
 * Autocomplete brand search hook params.
 */
export interface AutocompleteTagSearchParams {
  association: TagAssociation;
}

/**
 * Response from the autocomplete brand search.
 */
export interface AutocompleteTagSearchResponse extends APIResponse {
  results: Array<Tag>;
}

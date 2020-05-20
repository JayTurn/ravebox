/**
 * search.interface.ts
 * Interfaces for the search results.
 */

// Enumerators.
import { ResultType } from './search.enum';

// Interfaces.
import {
  CategorizedReviewGroup
} from '../review/review.interface';

/**
 * Autocomplete search results interfaces.
 */
export interface AutocompleteResults {
  results: Array<AutocompleteItem>;
}

/**
 * Explore search results.
 */
export interface ExploreResults {
  results: Array<CategorizedReviewGroup>;
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

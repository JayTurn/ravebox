/**
 * search.interface.ts
 * Interfaces for the search results.
 */

// Modules.
import * as Mongoose from 'mongoose';

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
  id: Mongoose.Types.ObjectId;
  resultType: ResultType;
  title: string;
  url?: string;
}

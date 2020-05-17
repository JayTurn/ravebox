/**
 * SearchFieldResults.interface.tsx
 * Interfaces for the search field results.
 */

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

/**
 * Search field results component properties.
 */
export interface SearchFieldResultsProps {
  query: string;
  results: Array<SearchFieldResult>
  retrievalStatus: RetrievalStatus;
}

/**
 * Individual search field result properties.
 */
export interface SearchFieldResult {
  title: string;
}

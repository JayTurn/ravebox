/**
 * SearchFieldResults.interface.tsx
 * Interfaces for the search field results.
 */

/**
 * Search field results component properties.
 */
export interface SearchFieldResultsProps {
  results: Array<SearchFieldResult>
  query: string;
}

/**
 * Individual search field result properties.
 */
export interface SearchFieldResult {
  title: string;
}

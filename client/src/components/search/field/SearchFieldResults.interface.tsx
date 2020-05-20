/**
 * SearchFieldResults.interface.tsx
 * Interfaces for the search field results.
 */

// Enumerators.
import { ResultType } from '../Search.enum';
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { RouteComponentProps } from 'react-router';

/**
 * Search field results component properties.
 */
export interface SearchFieldResultsProps extends RouteComponentProps {
  query: string;
  results: Array<SearchFieldResult>
  retrievalStatus: RetrievalStatus;
  closeSearchResults: () => void;
}

/**
 * Individual search field result properties.
 */
export interface SearchFieldResult {
  id: string;
  resultType: ResultType;
  title: string;
  url?: string;
}

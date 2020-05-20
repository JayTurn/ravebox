/**
 * useAutocompleteSearch.hook.ts
 * Performs an autocomplete search request and returns results.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import debounce from 'lodash/debounce';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import {
  AutocompleteSearchParams,
  AutocompleteSearchResponse,
  AutocompleteSearchResult
} from './SearchField.interface';

/**
 * Sets the default retrieval status.
 *
 * @param { string } query - the query to be searched.
 *
 * @return RetrievalStatus
 */
const setDefaultRetrievalStatus: (
  query: string
) => RetrievalStatus = (
  query: string
): RetrievalStatus => {

  // Set the default retrieval status.
  let retrievalStatus: RetrievalStatus = RetrievalStatus.REQUESTED;

  // If we don't have a query, set the status as failed so we don't attempt
  // to perform an API request.
  if (!query) {
    retrievalStatus = RetrievalStatus.FAILED;
  }

  return retrievalStatus;
}

/**
 * Returns a list or results if found.
 */
export function useAutocompleteSearch() {

  // Define the retrieval status to be used for view rendering.
  const [retrievalStatus, setRetrievalStatus] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Define the results to be returned.
  const [results, setResults] = React.useState<Array<AutocompleteSearchResult>>([]);

  // Define the query 
  const [query, setQuery] = React.useState<string>('');

  // Define the debounce function for search queries.
  const delayedQuery = React.useCallback(debounce((q: string) => performSearch(q), 300), []);

  /**
   * Performs a search for similar product names.
   */
  const performSearch: (
    query: string
  ) => Promise<void> = async (
    query: string
  ): Promise<void> => {

    if (!query) {
      setQuery(query);
      setResults([]);
      setRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
      return;
    }

    // Set the submission state.
    setRetrievalStatus(RetrievalStatus.WAITING);

    setQuery(query);

    // Performt he product name search.
    API.requestAPI<AutocompleteSearchResponse>(`search/autocomplete/${encodeURIComponent(query)}`, {
      method: RequestType.GET,
    })
    .then((response: AutocompleteSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setResults([]);
        setRetrievalStatus(RetrievalStatus.NOT_FOUND);
      } else {
        // Set the options returned.
        setResults([...response.results]);
        setRetrievalStatus(RetrievalStatus.SUCCESS);
      }
    })
    .catch((error: Error) => {
      setResults([]);
      setRetrievalStatus(RetrievalStatus.NOT_FOUND);
    });
  }

  /**
   * Clears the search.
   */
  const closeSearchResults: (
  ) => void = (
  ): void => {
    setResults([]);
    setRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
  }

  return {
    closeSearchResults,
    delayedQuery,
    query,
    results,
    retrievalStatus,
  }
}

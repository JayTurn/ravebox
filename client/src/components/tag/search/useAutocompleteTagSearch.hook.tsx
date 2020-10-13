/**
 * useAutocompleteTagSearch.hook.ts
 * Performs an autocomplete search request and returns brands.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Cookies from 'universal-cookie';
import debounce from 'lodash/debounce';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import {
  AutocompleteTagSearchParams,
  AutocompleteTagSearchResponse
} from './AutocompleteTagSearch.interface';
import { Tag } from '../Tag.interface';

/**
 * Returns a list of tag results if found.
 */
export function useAutocompleteTagSearch(params: AutocompleteTagSearchParams) {

  // Define the retrieval status to be used for view rendering.
  const [tagRetrievalStatus, setTagRetrievalStatus] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Define the results to be returned.
  const [tagResults, setTagResults] = React.useState<Array<Tag>>([]);
  const [tagResultNames, setTagResultNames] = React.useState<Array<string>>([]);

  // Define the query 
  const [tagQuery, setTagQuery] = React.useState<string>('');

  // Define the debounce function for search queries.
  const delayedTagQuery = React.useCallback(debounce((q: string) => performTagSearch(q), 300), []);

  /**
   * Clears the search.
   */
  const closeTagSearchResults: (
  ) => void = (
  ): void => {
    setTagQuery('');
    setTagResultNames([]);
    setTagResults([]);
    setTagRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
  }

  /**
   * Performs a search for similar tag names.
   */
  const performTagSearch: (
    query: string
  ) => Promise<void> = async (
    query: string
  ): Promise<void> => {

    if (!query) {
      setTagQuery(query);
      setTagResultNames([]);
      setTagResults([]);
      setTagRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
      return;
    }

    const cookie: Cookies = new Cookies(),
          security: string = cookie.get('XSRF-TOKEN');

    // Set the submission state.
    setTagRetrievalStatus(RetrievalStatus.WAITING);

    setTagQuery(query);

    // Perform the product name search.
    API.requestAPI<AutocompleteTagSearchResponse>(`search/tag/autocomplete/${encodeURIComponent(query)}`, {
      body: JSON.stringify({
        association: params.association
      }),
      headers: {
        'x-xsrf-token': security
      },
      method: RequestType.POST
    })
    .then((response: AutocompleteTagSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setTagResultNames([]);
        setTagResults([]);
        setTagRetrievalStatus(RetrievalStatus.NOT_FOUND);
      } else {
        // Set the options returned.
        setTagResults([...response.results]);
        setTagResultNames(response.results.map((brand: Tag) => {
          return brand.name;
        }));
        setTagRetrievalStatus(RetrievalStatus.SUCCESS);
      }
    })
    .catch((error: Error) => {
      setTagResultNames([]);
      setTagResults([]);
      setTagRetrievalStatus(RetrievalStatus.NOT_FOUND);
    });
  }

  return {
    tagQuery,
    tagResultNames,
    tagResults,
    tagRetrievalStatus,
    closeTagSearchResults,
    delayedTagQuery
  }
}

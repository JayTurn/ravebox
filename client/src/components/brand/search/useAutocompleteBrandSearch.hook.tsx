/**
 * useAutocompleteBrandSearch.hook.ts
 * Performs an autocomplete search request and returns brands.
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
  AutocompleteBrandSearchParams,
  AutocompleteBrandSearchResponse
} from './AutocompleteBrandSearch.interface';
import { Brand } from '../../brand/Brand.interface';

/**
 * Returns a list of brand results if found.
 */
export function useAutocompleteBrandSearch() {

  // Define the retrieval status to be used for view rendering.
  const [brandRetrievalStatus, setBrandRetrievalStatus] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Define the results to be returned.
  const [brandResults, setBrandResults] = React.useState<Array<Brand>>([]);
  const [brandResultNames, setBrandResultNames] = React.useState<Array<string>>([]);

  // Define the query 
  const [brandQuery, setBrandQuery] = React.useState<string>('');

  // Define the debounce function for search queries.
  const delayedBrandQuery = React.useCallback(debounce((q: string) => performBrandSearch(q), 300), []);

  /**
   * Clears the search.
   */
  const closeBrandSearchResults: (
  ) => void = (
  ): void => {
    setBrandQuery('');
    setBrandResultNames([]);
    setBrandResults([]);
    setBrandRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
  }

  /**
   * Performs a search for similar product names.
   */
  const performBrandSearch: (
    query: string
  ) => Promise<void> = async (
    query: string
  ): Promise<void> => {

    if (!query) {
      setBrandQuery(query);
      setBrandResultNames([]);
      setBrandResults([]);
      setBrandRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
      return;
    }

    // Set the submission state.
    setBrandRetrievalStatus(RetrievalStatus.WAITING);

    setBrandQuery(query);

    // Perform the product name search.
    API.requestAPI<AutocompleteBrandSearchResponse>(`search/brand/autocomplete/${encodeURIComponent(query)}`, {
      method: RequestType.GET,
    })
    .then((response: AutocompleteBrandSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setBrandResultNames([]);
        setBrandResults([]);
        setBrandRetrievalStatus(RetrievalStatus.NOT_FOUND);
      } else {
        // Set the options returned.
        setBrandResults([...response.results]);
        setBrandResultNames(response.results.map((brand: Brand) => {
          return brand.name;
        }));
        setBrandRetrievalStatus(RetrievalStatus.SUCCESS);
      }
    })
    .catch((error: Error) => {
      setBrandResultNames([]);
      setBrandResults([]);
      setBrandRetrievalStatus(RetrievalStatus.NOT_FOUND);
    });
  }

  return {
    brandQuery,
    brandResultNames,
    brandResults,
    brandRetrievalStatus,
    closeBrandSearchResults,
    delayedBrandQuery
  }
}

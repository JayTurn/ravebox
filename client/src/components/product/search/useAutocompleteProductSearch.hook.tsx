/**
 * useAutocompleteProductSearch.hook.ts
 * Performs an autocomplete search request and returns products.
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
  AutocompleteProductSearchParams,
  AutocompleteProductSearchResponse
} from './AutocompleteProductSearch.interface';
import { Product } from '../Product.interface';

/**
 * Returns a list of product results if found.
 */
export function useAutocompleteProductSearch() {

  // Define the retrieval status to be used for view rendering.
  const [productRetrievalStatus, setProductRetrievalStatus] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Define the results to be returned.
  const [productResults, setProductResults] = React.useState<Array<Product>>([]);
  const [productResultNames, setProductResultNames] = React.useState<Array<string>>([]);

  // Define the query 
  const [productQuery, setProductQuery] = React.useState<string>('');

  // Define the debounce function for search queries.
  const delayedProductQuery = React.useCallback(debounce((q: string) => performProductSearch(q), 300), []);

  /**
   * Clears the search.
   */
  const closeProductSearchResults: (
  ) => void = (
  ): void => {
    setProductQuery('');
    setProductResultNames([]);
    setProductResults([]);
    setProductRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
  }

  /**
   * Performs a search for similar product names.
   */
  const performProductSearch: (
    query: string
  ) => Promise<void> = async (
    query: string
  ): Promise<void> => {

    if (!query) {
      setProductQuery(query);
      setProductResultNames([]);
      setProductResults([]);
      setProductRetrievalStatus(RetrievalStatus.NOT_REQUESTED);
      return;
    }

    // Set the submission state.
    setProductRetrievalStatus(RetrievalStatus.WAITING);

    setProductQuery(query);

    // Perform the product name search.
    API.requestAPI<AutocompleteProductSearchResponse>(`search/product/autocomplete/${encodeURIComponent(query)}`, {
      method: RequestType.GET,
    })
    .then((response: AutocompleteProductSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setProductResultNames([]);
        setProductResults([]);
        setProductRetrievalStatus(RetrievalStatus.NOT_FOUND);
      } else {
        // Set the options returned.
        setProductResults([...response.results]);
        setProductResultNames(response.results.map((product: Product) => {
          return `${product.brand.name} ${product.name}`;
        }));
        setProductRetrievalStatus(RetrievalStatus.SUCCESS);
      }
    })
    .catch((error: Error) => {
      setProductResultNames([]);
      setProductResults([]);
      setProductRetrievalStatus(RetrievalStatus.NOT_FOUND);
    });
  }

  return {
    productQuery,
    productResultNames,
    productResults,
    productRetrievalStatus,
    closeProductSearchResults,
    delayedProductQuery
  }
}

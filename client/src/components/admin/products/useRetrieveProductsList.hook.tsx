/**
 * useRetrieveProductsList.hook.ts
 * Retrieves the list of app products.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import * as React from 'react';
import Cookies from 'universal-cookie';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import { Product } from '../../product/Product.interface';
import {
  RetrieveProductsListParams,
  RetrieveProductsListResponse
} from './AdminProducts.interface';

/**
 * Returns a list of products if they exist.
 */
export function useRetrieveProductsList(params: RetrieveProductsListParams) {

  // Set the default state for retrieving the list of products.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  const [products, setProducts] = React.useState<Array<Product>>([]);

  const [options, setOptions] = React.useState<RetrieveProductsListParams>(params);

  /**
   * Handle state updates based on the presence of an admin user.
   */
  React.useEffect(() => {
    const cookie: Cookies = new Cookies(),
          security: string = cookie.get('XSRF-TOKEN');

    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the list of users.
      API.requestAPI<RetrieveProductsListResponse>('admin/products', {
        body: JSON.stringify(options),
        headers: {
          'x-xsrf-token': security
        },
        method: RequestType.POST

      })
      .then((response: RetrieveProductsListResponse) => {
        if (response.products) {
          setProducts(response.products);
          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          setRetrieved(RetrievalStatus.FAILED);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [retrieved]);

  /**
   * Updates a product in the list.
   *
   * @param { Product } product - the product to be updated.
   * @param { number } index - the index of the product in the list.
   */
  const updateProductInList: (
    product: Product
  ) => (
    index: number
  ) => void = (
    product: Product
  ) => (
    index: number
  ): void => {
    const updatedProductList: Array<Product> = [...products];

    if (updatedProductList[index]) {
      updatedProductList[index] = {...product};

      setProducts([...updatedProductList]);
    }
  }

  return {
    retrievalStatus: retrieved,
    products: products,
    updateProductInList
  }
}

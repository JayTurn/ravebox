/**
 * useRetrieveProduct.hook.ts
 * Retrieves the product if we have a valid id.
 */

// Modules.
import API from '../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';

// Interfaces.
import {
  Product,
  ProductResponse,
  RetrieveProductByIdParams,
  RetrieveProductByURLParams
} from './Product.interface';

/**
 * Sets the default retrieval status.
 *
 * @param { H.Location } url - the url location.
 *
 * @return RetrievalStatus
 */
const setDefaultRetrievalStatus: (
  id: string
) => RetrievalStatus = (
  id: string
): RetrievalStatus => {

  // Set the default retrieval status.
  let retrievalStatus: RetrievalStatus = RetrievalStatus.REQUESTED;

  // If we don't have an id, set the status as failed so we don't attempt
  // to perform an API request.
  if (!id) {
    retrievalStatus = RetrievalStatus.FAILED;
  }

  return retrievalStatus;
}

/**
 * Returns a product if it exists.
 */
export function useRetrieveProductById(params: RetrieveProductByIdParams) {

  // Retrieve the product id from the match url provided.
  const id: string = params.id;

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(setDefaultRetrievalStatus(id)); 

  // Define the product to be used for view rendering.
  const [product, setProduct] = React.useState({
    _id: '',
    brand: '',
    categories: [{key: '', label: ''}],
    name: ''
  });

  /**
   * Handle state updates based on the presence of a product.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile.
      API.requestAPI<ProductResponse>(`product/${id}`, {
        method: RequestType.GET
      })
      .then((response: ProductResponse) => {
        // Set the product and update the retrieval state.
        if (setProduct) {
          setProduct(response.product);
          setRetrieved(RetrievalStatus.SUCCESS);

        } else {
          // We couldn't find the product so return an appropriate response
          // for the view to render accordingly.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [product]);

  return {
    product: product,
    productStatus: retrieved
  }
}

/**
 * Returns a product if it exists using the url.
 */
export function useRetrieveProductByURL(params: RetrieveProductByURLParams) {

  /*
  // Retrieve the product id from the match url provided.
  const brand: string = params.brand,
        productName: string = params.productName,
        reviewTitle: string = params.reviewTitle;

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(setDefaultRetrievalStatus(reviewTitle)); 

  // Define the product to be used for view rendering.
  const [review, setProduct] = React.useState({
    _id: '',
    brand: '',
    categories: [{key: '', label: ''}],
    name: ''
  });
  */

  /**
   * Handle state updates based on the presence of a product.
   */
  /*
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile.
      API.requestAPI<ProductResponse>(`product/${id}`, {
        method: RequestType.GET
      })
      .then((response: ProductResponse) => {
        // Set the product and update the retrieval state.
        if (setProduct) {
          setProduct(response.product);
          setRetrieved(RetrievalStatus.SUCCESS);

        } else {
          // We couldn't find the product so return an appropriate response
          // for the view to render accordingly.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [product]);

  return {
    product: product,
    productStatus: retrieved
  }
  */
}

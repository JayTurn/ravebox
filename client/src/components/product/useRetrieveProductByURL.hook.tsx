/**
 * useRetrieveProduct.hook.ts
 * Retrieves the product if we have a valid id.
 */

// Modules.
import API from '../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import { Recommended } from '../review/recommendation/Recommendation.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';
import { VideoType } from '../review/Review.enum';

// Hooks.
import { useIsMounted } from '../../utils/safety/useIsMounted.hook';

// Interfaces.
import {
  Product,
  ProductResponse,
  RetrieveProductByIdParams,
  RetrieveProductByURLParams
} from './Product.interface';
import { RaveStream } from '../raveStream/RaveStream.interface';
import {
  Review
} from '../review/Review.interface';

// Utilities.
import { emptyRaveStream } from '../raveStream/RaveStream.common';
import { emptyProduct } from './Product.common';
import { ViewStatus } from '../../utils/display/view/View';

/**
 * Returns a product if it exists using the url.
 *
 * @param { RetrieveProductByURLParams } params - the product params.
 */
export function useRetrieveProductByURL(params: RetrieveProductByURLParams) {

  // Format the api request path.
  const {
    existing,
    setProductView,
    requested,
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  const path: string = `${requested.brand}/${requested.productName}`;

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Define the product to be set.
  const [product, setProduct] = React.useState<Product>(existing ? existing.product : emptyProduct());

  // Define the product reviews to be set.
  const [raveStream, setRaveStream] = React.useState<RaveStream>(
    existing && existing.raveStream
      ? existing.raveStream
      : emptyRaveStream()
  );

  const [requestedPath, setRequestedPath] = React.useState<string>(path);

  /**
   * Handle state updates to the requested path.
   */
  React.useEffect(() => {
    if (path !== requestedPath || !product.url
      && retrieved !== RetrievalStatus.WAITING) {
      setRetrieved(RetrievalStatus.REQUESTED);
      setRequestedPath(path);
    }
  }, [path, product, requestedPath]);

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile.
      API.requestAPI<ProductResponse>(`product/view/${requestedPath}`, {
        method: RequestType.GET
      })
      .then((response: ProductResponse) => {
        if (!isMounted.current) {
          return;
        }
        // If we have a product, set the product in the redux store and the
        // local state.
        if (response.product) {
          if (setProductView) {
            setProductView({
              ...response
            });
            setProduct(response.product)
            // If we have reviews, set them.
            if (response.raveStream) {
              setRaveStream(response.raveStream);
            }
          }
          setRetrieved(RetrievalStatus.SUCCESS);

        } else {
          // We couldn't find the product so return an appropriate response
          // for the view to render accordingly.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        if (isMounted.current) {
          setRetrieved(RetrievalStatus.FAILED);
        }
      });
    }
  }, [retrieved]);

  return {
    product,
    productStatus: ViewStatus(retrieved),
    raveStream
  }
}

/**
 * useRetrieveRaveStreamByProduct.hook.ts
 * Retrieves a list of similar product streams.
 */

// Modules.
import API from '../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';

// Hooks.
import { useIsMounted } from '../../utils/safety/useIsMounted.hook';

// Interfaces.
import {
  Product
} from '../product/Product.interface';
import {
  RaveStream,
  RaveStreamResponse,
  RetrieveStreamByProductParams
} from './RaveStream.interface';
import {
  Review
} from '../review/Review.interface';

// Utilities.
import { emptyProduct } from '../product/Product.common';
import {
  buildRaveStreamPath,
  emptyRaveStream
} from './RaveStream.common';
import { ViewStatus } from '../../utils/display/view/View';

/**
 * Returns a rave stream for the product if it exists.
 *
 * @param { RetrieveStreamByProductParams } params - the product params.
 */
export function useRetrieveRaveStreamByProduct(
  params: RetrieveStreamByProductParams
) {

  // Format the api request path.
  const {
    product
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);
  
  const [productStream, setProductStream] = React.useState<RaveStream | null>(null);

  const [productId, setProductId] = React.useState<string | null>(null);

  const [firstLoad, setFirstLoad] = React.useState<boolean>(true);

  /**
   * Perform an update request when the product id changes.
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    if (product && product._id !== productId) {
      setProductId(product._id);
      setRetrieved(RetrievalStatus.REQUESTED);
    }
    if (productId && firstLoad) {
      setRetrieved(RetrievalStatus.REQUESTED);
      setFirstLoad(false);
    }
  }, [product, productId])

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED && product && productId) {
      if (isMounted) {
        // Update the retrieval status to avoid subsequent requests.
        setRetrieved(RetrievalStatus.WAITING);
      }

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamResponse>(`stream/product/${product.brand.url}/${product.url}`, {
        method: RequestType.GET,
      })
      .then((response: RaveStreamResponse) => {
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.raveStream) {
          if (isMounted) {
            setRetrieved(RetrievalStatus.SUCCESS);
            setProductStream(response.raveStream);
          }
        } else {
          if (isMounted) {
            setRetrieved(RetrievalStatus.NOT_FOUND);
            setProductStream(null);
          }
        }
      })
      .catch((error: Error) => {
        if (isMounted) {
          setRetrieved(RetrievalStatus.FAILED);
          setProductStream(null);
        }
      });
    }
  }, [retrieved, isMounted]);

  return {
    productStream,
    raveStreamsStatus: ViewStatus(retrieved)
  }
}

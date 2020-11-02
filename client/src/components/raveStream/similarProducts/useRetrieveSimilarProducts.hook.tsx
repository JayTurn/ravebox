/**
 * useRetrieveSimilarProducts.hook.ts
 * Retrieves a list of similar product streams.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Hooks.
import { useIsMounted } from '../../../utils/safety/useIsMounted.hook';

// Interfaces.
import {
  Product
} from '../../product/Product.interface';
import {
  RaveStream,
  RaveStreamListResponse
} from '../RaveStream.interface';
import { RetrieveSimilarProductParams } from './SimilarProducts.interface';
import {
  Review
} from '../../review/Review.interface';

// Utilities.
import { emptyProduct } from '../../product/Product.common';
import {
  buildRaveStreamPath,
  emptyRaveStream
} from '../RaveStream.common';
import { ViewStatus } from '../../../utils/display/view/View';

/**
 * Returns a list similar product rave streams if they exist.
 *
 * @param { RetrieveSimilarProductsParams } params - the similar product params.
 */
export function useRetrieveSimilarProducts(
  params: RetrieveSimilarProductParams
) {

  // Format the api request path.
  const {
    product
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);
  
  const [raveStreams, setRaveStreams] = React.useState<Array<RaveStream>>([]);

  const [productId, setProductId] = React.useState<string | null>(product._id);

  /**
   * Perform an update request when the product id changes.
   */
  React.useEffect(() => {
    if (product._id !== productId) {
      setProductId(product._id);
      setRetrieved(RetrievalStatus.REQUESTED);
    }
  }, [product, productId])

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED && productId) {
      if (isMounted) {
        // Update the retrieval status to avoid subsequent requests.
        setRetrieved(RetrievalStatus.WAITING);
      }

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamListResponse>(`stream/similar_products/${product._id}`, {
        method: RequestType.GET,
      })
      .then((response: RaveStreamListResponse) => {
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.raveStreams) {
          if (isMounted) {
            setRetrieved(RetrievalStatus.SUCCESS);
            setRaveStreams(response.raveStreams);
          }
        } else {
          if (isMounted) {
            setRetrieved(RetrievalStatus.NOT_FOUND);
            setRaveStreams([]);
          }
        }
      })
      .catch((error: Error) => {
        if (isMounted) {
          setRetrieved(RetrievalStatus.FAILED);
          setRaveStreams([]);
        }
      });
    }
  }, [retrieved, isMounted]);

  return {
    raveStreams,
    raveStreamsStatus: ViewStatus(retrieved)
  }
}

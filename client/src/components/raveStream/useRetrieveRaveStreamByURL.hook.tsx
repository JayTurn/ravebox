/**
 * useRetrieveProductStreamByURL.hook.ts
 * Retrieves a product stream based on the URL provided.
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

// Interfaces.
import {
  Product
} from '../product/Product.interface';
import {
  RaveStream,
  RaveStreamResponse,
  RaveStreamURLParams,
  RetrieveStreamByURLParams
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
 * Returns the first product in the list of reviews.
 *
 * @param { RaveStream } raveStream - the current rave stream.
 *
 * @return Product
 */
const retrieveProductFromStream: (
  raveStream?: RaveStream
) => Product = (
  raveStream?: RaveStream
): Product => {
  if (!raveStream || !raveStream.reviews || raveStream.reviews.length <= 0) {
    return {...emptyProduct()};
  }

  return {...raveStream.reviews[0].product || emptyProduct()};
}

/**
 * Returns a rave stream if it exists using the url.
 *
 * @param { RetrieveProductStreamByURLParams } params - the product params.
 */
export function useRetrieveRaveStreamByURL(
  params: RetrieveStreamByURLParams
) {

  // Format the api request path.
  const {
    existing,
    requested,
    setActiveRaveStream,
  } = {...params};

  let path: string = buildRaveStreamPath({...requested});

  // Define the product path to be used for triggering requests for a stream.
  const [productPath, setProductPath] = React.useState<string>(path);

  // Define a state for the url parameters to track changes.
  const [requestParams, setRequestParams] = React.useState<RaveStreamURLParams>({...requested});

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED);

  // Define the rave stream to be set using the existing value if it has
  // been preloaded via sever side rendering.
  const [raveStream, setRaveStream] = React.useState<RaveStream>(existing ? existing : {...emptyRaveStream()});

  // Define the active product to be displayed in the stream.
  const [product, setProduct] = React.useState<Product>(retrieveProductFromStream(existing))

  const [requestedPath, setRequestedPath] = React.useState<string>(path);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  /**
   * Handle state updates to the requested path.
   */
  React.useEffect(() => {
    //if (!product.url && retrieved !== RetrievalStatus.WAITING) {
      //setRetrieved(RetrievalStatus.REQUESTED);
    //}
  }, [
    product,
    productPath,
    requestedPath,
    retrieved
  ]);

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamResponse>(`stream/${requestedPath}`, {
        method: RequestType.GET
      })
      .then((response: RaveStreamResponse) => {
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.raveStream) {
          if (setActiveRaveStream) {
            setActiveRaveStream({...response.raveStream});
            setProduct(retrieveProductFromStream(response.raveStream));
          }
          setRetrieved(RetrievalStatus.SUCCESS);

        } else {
          // We didn't return an active rave stream so return a not found
          // state.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [retrieved]);

  return {
    activeIndex,
    raveStream,
    product,
    raveStreamStatus: ViewStatus(retrieved)
  }
}

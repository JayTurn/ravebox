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

// Hooks.
import { useIsMounted } from '../../utils/safety/useIsMounted.hook';

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
 * Returns the index of the rave based on the url and ravestream.
 *
 * @param { string } url - the url to match.
 * @param { RaveStream } raveStream - the raveStream we're working with.
 *
 * @return number
 */
const getRaveIndex: (
  url: string
) => (
  raveStream: RaveStream | undefined
) => number | undefined = (
  url: string
) => (
  raveStream: RaveStream | undefined
): number | undefined => {

  if (!raveStream || !url || !raveStream.reviews) {
    return;
  }

  if (raveStream.reviews.length <= 0) {
    return;
  }

  // Find the index of the current review.
  let index: number = raveStream.reviews.findIndex((review: Review) => {
    return review.url === url;
  });

  return index;
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
    ignoreRavePath,
    requested,
    setActiveProduct,
    setActiveRaveStream,
    setActiveRave,
    swipeControlled,
    updateLoading
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  const [path, setPath] = React.useState<string>();

  const [contextPath, setContextPath] = React.useState<string>(buildRaveStreamPath({...requested})(true));

  // Define a state for the url parameters to track changes.
  const [requestParams, setRequestParams] = React.useState<RaveStreamURLParams>({...requested});

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED);

  // Define the rave stream to be set using the existing value if it has
  // been preloaded via sever side rendering.
  const [raveStream, setRaveStream] = React.useState<RaveStream>(existing ? existing : {...emptyRaveStream()});

  const [existingPath, setExistingPath] = React.useState<string>('');

  const [requestedPath, setRequestedPath] = React.useState<string>(buildRaveStreamPath({...requested})(false));

  /**
   * Determine if we should update the active index or request a new RaveStream.
   *
   * @param { string } url - the url to be requested.
   */
  const loadRave: (
    url: string
  ) => (
    updatedParams: RaveStreamURLParams
  ) => void = (
    url: string
  ) => (
    updatedParams: RaveStreamURLParams
  ): void => {
    if (!isMounted.current) {
      return;
    }

    if (retrieved === RetrievalStatus.WAITING || retrieved === RetrievalStatus.REQUESTED) {
      return;
    }

    const updatedPath: string = buildRaveStreamPath({...updatedParams})(true);

    if (updatedParams) {

      if (contextPath && contextPath !== updatedPath) {
        setRequestParams({...updatedParams});
        setRequestedPath(buildRaveStreamPath({...updatedParams})(false));

        if (contextPath) {
          setContextPath(updatedPath);
        }
        setTimeout(() => {
          setRetrieved(RetrievalStatus.REQUESTED);
        }, 0);
        return;
      }
    } 

    const index: number | undefined = getRaveIndex(url)(existing);

    if (typeof index !== 'number') {
      return;
    }

    if (index === -1) {
      setRequestParams({...requested});
      setTimeout(() => {
        setRetrieved(RetrievalStatus.REQUESTED);
      }, 0);
      if (contextPath) {
        setContextPath(updatedPath);
      }
    } else {
      if (setActiveRave) {
        setActiveRave(index);
        if (existing && existing.reviews && existing.reviews[index]) {
          if (setActiveProduct) {
            const product: Product | undefined = existing.reviews[index].product;
            if (product) {
              setActiveProduct({...product});
            }
          }
        }
        if (!contextPath) {
          setContextPath(updatedPath);
        }
      }
    }
  }


  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }

    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {

      if (updateLoading) {
        updateLoading(true);
      }
      
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamResponse>(`stream/${requestedPath}`, {
        method: RequestType.GET
      })
      .then((response: RaveStreamResponse) => {

        if (!isMounted.current) {
          return;
        }

        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.raveStream) {
          if (setActiveRaveStream && setActiveProduct && setActiveRave) {
            setActiveRave(0);
            setActiveRaveStream({...response.raveStream});
            setActiveProduct(retrieveProductFromStream(response.raveStream));
          }

          setRetrieved(RetrievalStatus.SUCCESS);

          if (updateLoading) {
            updateLoading(false);
          }

        } else {
          // We didn't return an active rave stream so return a not found
          // state.
          setRetrieved(RetrievalStatus.NOT_FOUND);
          if (updateLoading) {
            updateLoading(false);
          }
        }
      })
      .catch((error: Error) => {
        if (isMounted.current) {
          setRetrieved(RetrievalStatus.FAILED);
          if (updateLoading) {
            updateLoading(false);
          }
        }
      });
    }

  }, [isMounted, retrieved]);

  return {
    isMounted,
    loadRave,
    raveStream,
    raveStreamStatus: ViewStatus(retrieved)
  }
}

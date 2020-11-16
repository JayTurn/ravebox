/**
 * useRetrieveStreamsCategoryList.hook.ts
 * Retrieves a list of streams based on the values provided.
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
  RaveStreamCategoryList,
  RaveStreamCategoryListResponse,
  RaveStreamListItem,
  RaveStreamListParams,
  RetrieveStreamCategoryListParams
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
 * Returns a list of rave streams if they exist.
 *
 * @param { RetrieveStreamCategoryListParams } params - the list params.
 */
export function useRetrieveRaveStreamCategoryList(
  params: RetrieveStreamCategoryListParams
) {

  // Format the api request path.
  const {
    existing,
    name,
    updateList
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(existing && existing.length > 0 
    ? RetrievalStatus.SUCCESS
    : RetrievalStatus.REQUESTED
  );

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

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamCategoryListResponse>(`stream/category_list`, {
        method: RequestType.GET
      })
      .then((response: RaveStreamCategoryListResponse) => {
        if (!isMounted.current) {
          return;
        }
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.raveStreams && updateList) {
          updateList(response.raveStreams);
          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          if (updateList) {
            // We didn't return an active rave stream so return a not found
            // state.
            updateList([]);
          }
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        if (!isMounted.current) {
          return;
        }

        if (updateList) {
          // We didn't return an active rave stream so return a not found
          // state.
          updateList([]);
        }
        setRetrieved(RetrievalStatus.FAILED);
      });
    }

  }, [retrieved, isMounted]);

  return {
    raveStreamsStatus: ViewStatus(retrieved)
  }
}

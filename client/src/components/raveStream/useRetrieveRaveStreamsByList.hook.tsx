/**
 * useRetrieveStreamsByList.hook.ts
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

// Interfaces.
import {
  Product
} from '../product/Product.interface';
import {
  RaveStream,
  RaveStreamListItem,
  RaveStreamListParams,
  RaveStreamListResponse,
  RetrieveStreamByListParams
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
 * @param { RetrieveStreamByListParams } params - the list params.
 */
export function useRetrieveRaveStreamByList(
  params: RetrieveStreamByListParams
) {

  // Format the api request path.
  const {
    existing,
    requested,
  } = {...params};

  // Define a state for the url parameters to track changes.
  const [requestParams, setRequestParams] = React.useState<Array<RaveStreamListItem>>([...requested]);

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED);

  // Define the rave stream to be set using the existing value if it has
  // been preloaded via sever side rendering.
  const [raveStreams, setRaveStreams] = React.useState<Array<RaveStream>|null>(
    existing ? existing : null
  );

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamListResponse>(`stream/list`, {
        method: RequestType.POST,
        body: JSON.stringify({
          list: requestParams
        })
      })
      .then((response: RaveStreamListResponse) => {
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.list) {
          setRaveStreams({...response.list});
          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          // We didn't return an active rave stream so return a not found
          // state.
          setRaveStreams(null);
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [retrieved]);

  return {
    raveStreams,
    raveStreamsStatus: ViewStatus(retrieved)
  }
}

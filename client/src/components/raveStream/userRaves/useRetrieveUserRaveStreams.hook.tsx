/**
 * useRetrieveUserRaveStreams.hook.ts
 * Retrieves a list user rave streams.
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
  RaveStream,
  RaveStreamListResponse
} from '../RaveStream.interface';
import { RetrieveUserRaveStreamParams } from './UserRaves.interface';

// Utilities.
import {
  buildRaveStreamPath,
  emptyRaveStream
} from '../RaveStream.common';
import { ViewStatus } from '../../../utils/display/view/View';

/**
 * Returns a list user rave streams if they exist.
 *
 * @param { UserRaveStreamsParams } params - the user params.
 */
export function useRetrieveUserRaveStreams(
  params: RetrieveUserRaveStreamParams
) {

  // Format the api request path.
  const {
    user,
    updateHeight
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);
  
  const [raveStreams, setRaveStreams] = React.useState<Array<RaveStream>>([]);

  const [userId, setUserId] = React.useState<string | null>(null);

  /**
   * Perform an update request when the user id changes.
   */
  React.useEffect(() => {
    if (isMounted.current) {
      if (user._id !== userId) {
        setUserId(user._id);
        setRetrieved(RetrievalStatus.REQUESTED);
      }
    }
  }, [isMounted, user, userId])

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED && userId) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the rave stream.
      API.requestAPI<RaveStreamListResponse>(`stream/user/${user._id}`, {
        method: RequestType.GET,
      })
      .then((response: RaveStreamListResponse) => {
        if (!isMounted.current) {
          return;
        }
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response.raveStreams) {
          setRetrieved(RetrievalStatus.SUCCESS);
          setRaveStreams(response.raveStreams);
          updateHeight();
        } else {
          setRetrieved(RetrievalStatus.NOT_FOUND);
          setRaveStreams([]);
          updateHeight();
        }
      })
      .catch((error: Error) => {
        if (!isMounted.current) {
          return;
        }
        setRetrieved(RetrievalStatus.FAILED);
        setRaveStreams([]);
        updateHeight();
      });
    }

  }, [retrieved, isMounted]);

  return {
    raveStreams,
    raveStreamsStatus: ViewStatus(retrieved)
  }
}

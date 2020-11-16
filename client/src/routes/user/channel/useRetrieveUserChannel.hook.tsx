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
  RaveStream
} from '../../../components/raveStream/RaveStream.interface';
import {
  RetrieveChannelParams,
  ChannelResponse
} from './Channel.interface';

// Utilities.
import {
  buildRaveStreamPath,
  emptyRaveStream
} from '../../../components/raveStream/RaveStream.common';
import { ViewStatus } from '../../../utils/display/view/View';

/**
 * Returns a user's channel based on their handle.
 *
 * @param { RetrieveChannelParams } params - the channel params.
 */
export function useRetrieveUserChannel(
  params: RetrieveChannelParams
) {

  // Format the api request path.
  const {
    handle,
    channel,
    updateActive
  } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);

  const [userHandle, setUserHandle] = React.useState<string | null>(null);

  /**
   * Perform an update request when the user id changes.
   */
  React.useEffect(() => {
    if (isMounted.current) {
      if (handle !== userHandle) {
        setUserHandle(handle);
        setRetrieved(RetrievalStatus.REQUESTED);
      }
    }
  }, [isMounted, handle, userHandle])

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED && userHandle) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the rave stream.
      API.requestAPI<ChannelResponse>(`user/channel/${userHandle}`, {
        method: RequestType.GET,
      })
      .then((response: ChannelResponse) => {
        if (!isMounted.current) {
          return;
        }
        // If we have a rave stream, set rave stream the in the redux store and the
        // local state.
        if (response) {
          setRetrieved(RetrievalStatus.SUCCESS);
          if (updateActive) {
            updateActive(response);
          }
        } else {
          setRetrieved(RetrievalStatus.NOT_FOUND);
          if (updateActive) {
            updateActive({});
          }
        }
      })
      .catch((error: Error) => {
        if (!isMounted.current) {
          return;
        }
        setRetrieved(RetrievalStatus.FAILED);
        if (updateActive) {
          updateActive({});
        }
      });
    }

  }, [retrieved, isMounted]);

  return {
    retrievalStatus: ViewStatus(retrieved)
  }
}

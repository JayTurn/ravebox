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
import { Review } from '../../review/Review.interface';

// Utilities.
import {
  buildRaveStreamPath,
  emptyRaveStream
} from '../RaveStream.common';
import { ViewStatus } from '../../../utils/display/view/View';

/**
 * Excludes the raves that match the provided id.
 *
 * @param { string } exclude - the id to exclude.
 * @param { Array<RaveStream> } raveStreams - the list of rave streams.
 *
 * @return Array<RaveStream>
 */
const updateRaveStreams: (
  exclude: string
) => (
  raveStreams: Array<RaveStream>
) => Array<RaveStream> = (
  exclude: string
) => (
  raveStreams: Array<RaveStream>
): Array<RaveStream> => {
  const updated: Array<RaveStream> = [];

  // Exit if we don't have any rave streams.
  if (raveStreams.length <= 0) {
    return raveStreams;
  }

  let i: number = 0;

  do {
    const updatedStream: RaveStream = raveStreams[i];

    // Skip this rave stream if we don't have any raves in the stream.
    if (updatedStream.reviews.length <= 0) {
      continue;
    }

    // Create a new list of reviews to be added to the updated list, without
    // the excluded one.
    const reviews: Array<Review> = updatedStream.reviews.filter(
      (review: Review) => {
        return review._id !== exclude;
      }
    );

    // We only want to add the rave stream if there are reviews left in it.
    if (reviews.length > 0) {
      updatedStream.reviews = [...reviews]; 

      updated.push(updatedStream);
    }
    i++;
  } while (i < raveStreams.length);

  return updated;
};

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
    exclude,
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
  React.useEffect(
    () => {
      if (isMounted.current) {
        if (user._id !== userId) {
          setUserId(user._id);
          setRetrieved(RetrievalStatus.REQUESTED);
        }
      }
    },
    [isMounted, user, userId]
  );

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
          setRaveStreams(updateRaveStreams(exclude || '')(response.raveStreams));
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

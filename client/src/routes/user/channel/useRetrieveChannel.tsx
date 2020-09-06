/**
 * useRetrieveChannel.hook.ts
 * Retrieves the user's channel.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import * as React from 'react';
import Cookies from 'universal-cookie';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import {
  ChannelDetails,
  ChannelResponse,
  RetrieveChannelParams,
} from './Channel.interface';

// Utilities.
import { CountIdentifier } from '../../../utils/display/numeric/Numeric';

/**
 * Determines if the currently loaded channel is the one requested.
 *
 * @param { string } handle - the requested handle.
 * @param { ChannelDetails } channel - the currently loaded channel.
 *
 * @return RetrievalStatus
 */
const setRequestStatus:(
  handle: string
) => (
  channel: ChannelDetails | undefined
) => RetrievalStatus = (
  handle: string
) => (
  channel: ChannelDetails | undefined
): RetrievalStatus => {
  let retrievalStatus: RetrievalStatus = RetrievalStatus.REQUESTED;

  if (channel && channel.profile) {
    if (handle === channel.profile.handle) {
      retrievalStatus = RetrievalStatus.SUCCESS;
    }
  }

  return retrievalStatus;
}


/**
 * Returns the public channel information for a user.
 */
export function useRetrieveChannel(params: RetrieveChannelParams) {

  // Retrieve the parameters.
  const {
    handle,
    channel,
    updateActive
  } = {...params};

  // Define the retrieval status for the current channel.
  const [retrieved, setRetrieved] = React.useState(setRequestStatus(handle)(channel)); 

  /**
   * Handle state updates based on the presence of a profile.
   */
  React.useEffect(() => {

    // Determine if we should perform the request.
    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile.
      API.requestAPI<ChannelResponse>(`user/channel/${handle}`, {
        method: RequestType.GET,
      })
      .then((response: ChannelResponse) => {
        if (response.errorCode) {
          setRetrieved(RetrievalStatus.FAILED);
          return;
        }

        if (updateActive) {

          if (response.channel.profile) {
            const channelDetails = {
              profile: {
                _id: response.channel.profile._id,
                avatar: response.channel.profile.avatar,
                handle: response.channel.profile.handle,
                ravesCount: CountIdentifier(response.channel.reviews ? response.channel.reviews.length : 0)('rave')
              },
              reviews: response.channel.reviews
            };

            updateActive(channelDetails);
            setRetrieved(RetrievalStatus.SUCCESS);
          } else {
            setRetrieved(RetrievalStatus.NOT_FOUND);
          }
        } else {
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });

    }
  }, [handle, updateActive]);

  return {
    retrievalStatus: retrieved
  }
}

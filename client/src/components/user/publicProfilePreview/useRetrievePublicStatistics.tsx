/**
 * useRetrievePublicProfileStatistics.hook.ts
 * Retrieves the public statistics for a user.
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
  PublicProfileStatistics,
  PublicProfileStatisticsResponse,
  RetrievePublicProfileStatisticsParams
} from './PublicProfilePreview.interface';

/**
 * Returns user statistics.
 */
export function useRetrievePublicProfileStatistics(params: RetrievePublicProfileStatisticsParams) {
  // Retrieve the user id and xsrf token used for the request.
  const { id } = {...params}

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  // Define the public profile statistics to be returned.
  const [profileStatistics, setProfileStatistics] = React.useState<PublicProfileStatistics>({
    ravesCount: '',
    subscriberCount: '' 
  });

  /**
   * Handle state updates based on the presence of a user id.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile statistics.
      API.requestAPI<PublicProfileStatisticsResponse>(`user/statistics/profile/${id}`, {
        method: RequestType.GET
      })
      .then((response: PublicProfileStatisticsResponse) => {

        if (!isMounted.current) {
          return;
        }

        // Set the review and update the retrieval state.
        if (setProfileStatistics) {

          let ravesCount: string = '';

          // Format the rave count text.
          if (response.statistics.ravesCount > 0) {
            ravesCount = response.statistics.ravesCount < 2 ?
              `1 rave` :
              `${response.statistics.ravesCount} raves`;
          }

          setProfileStatistics({
            ...profileStatistics,
            ravesCount: ravesCount
          });

          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          // We couldn't find the review so return an appropriate response
          // for the view to render accordingly.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [profileStatistics, retrieved]);

  return {
    profileStatistics,
    retrievalStatus: retrieved
  }
}

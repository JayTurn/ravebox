/**
 * useRetrieveFollowing.hook.ts
 * Handles functions for retrieving a list of followed raves.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Cookies from 'universal-cookie';
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
  RetrieveFollowingParams,
  RetrieveFollowingResponse
} from './Following.interface';
import { Review } from '../../../components/review/Review.interface';

/**
 * Retrieve following hook to handle the list of followed raves.
 */
export function useRetrieveFollowing(params: RetrieveFollowingParams) {
  // Define the reviews to be returned.
  const [reviews, setReviews] = React.useState<Array<Review> | null>(null);

  // Define the retrieval status for the current following.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  /**
   * Handle state updates based on the retrieval of reviews.
   */
  React.useEffect(() => {

    const cookie: Cookies = new Cookies(),
          security: string = cookie.get('XSRF-TOKEN');

    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's followed reviews.
      API.requestAPI<RetrieveFollowingResponse>('user/following', {
        method: RequestType.GET,
        headers: {
          'x-xsrf-token': security || ''
        }
      })
      .then((response: RetrieveFollowingResponse) => {
        if (response.errorCode) {
          setRetrieved(RetrievalStatus.FAILED);
          return;
        }

        if (response.reviews && response.reviews.length > 0) {
          setReviews(response.reviews);
          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  });

  return {
    reviews,
    retrievalStatus: retrieved
  }
}

/**
 * useRetrievePrivateReviews.hook.ts
 * Retrieves the reviews for the user to edit.
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
  PrivateReviewsResponse,
  RetrievePrivateReviewsParams,
} from './PrivateReviews.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Returns a list of reviews belonging to the authenticated user.
 */
export function useRetrievePrivateReviews(params: RetrievePrivateReviewsParams) {

  // Retrieve the parameters.
  const {
    setReviews,
    xsrf
  } = {...params};

  // Check if the current profile exists and contains a valid cookie.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  /**
   * Handle state updates based on the presence of a profile.
   */
  React.useEffect(() => {

    // Exit if we don't have the xsrf token.
    if (!xsrf) {
      return;
    }

    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);


      // Perform the API request to get the user's profile.
      API.requestAPI<PrivateReviewsResponse>('review/list/user', {
        method: RequestType.GET,
        headers: {
          'x-xsrf-token': xsrf || ''
        }
      })
      .then((response: PrivateReviewsResponse) => {
        if (setReviews) {
          if (response.errorCode) {
            setRetrieved(RetrievalStatus.FAILED);
            return;
          }

          setRetrieved(RetrievalStatus.SUCCESS);
          setReviews(response.reviews);

        } else {
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
      
      // Update the user's profile in the redux store.
    }
  }, [xsrf, setReviews]);

  return {
    reviewsStatus: retrieved
  }
}

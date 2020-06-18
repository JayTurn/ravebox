/**
 * useRating.hook.ts
 * Handles common functions for the rating component.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Cookies from 'universal-cookie';
import * as React from 'react';

// Enumerators.
import { Rating } from './Rate.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Hooks.
import { useIsMounted } from '../../../utils/safety/useIsMounted.hook';

// Interfaces.
import {
  RatingParams,
  RatingResponse,
  RatingResults
} from './Rate.interface';

// Utilities.
import { NumericSuffix } from '../../../utils/display/numeric/Numeric';

/**
 * Creates a rating token.
 */
export function useRate(params: RatingParams) {

  // Capture the review id from the parameters.
  const { reviewId } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  const [ratingResults, setRatingResults] = React.useState<RatingResults>({
    up: '0',
    down: '0'
  });

  // Define the retrieval status to be used for rating requests.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  /**
   * Handle state updates based on the presence of a review.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Retrieve the xsrf token if it exists.
      const cookies: Cookies = new Cookies();
      const xsrf: string = cookies.get('XSRF-TOKEN');

      // Perform the API request to get the user's profile.
      API.requestAPI<RatingResponse>(`statistics/review/rating/${reviewId}`, {
        headers: {
          'x-xsrf-token': xsrf || ''
        },
        method: RequestType.GET
      })
      .then((response: RatingResponse) => {
        if (response.results) {
          if (isMounted.current) {
            setRatingResults({
              up: NumericSuffix(parseInt(response.results.up || '0'))(1),
              down: NumericSuffix(parseInt(response.results.down || '0'))(1),
              userRating: response.results.userRating
            });
            setRetrieved(RetrievalStatus.SUCCESS);
          }
        } else {
          // We couldn't find the rating statistics so return an appropriate
          // response for the view to render accordingly.
          if (isMounted.current) {
            setRetrieved(RetrievalStatus.NOT_FOUND);
          }
        }
      })
      .catch((error: Error) => {
        console.log(error);
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [retrieved, reviewId, setRatingResults, setRetrieved]);

  /**
   * Performs an api request to rate a review using the token provided.
   */
  const rate: (
    rating: Rating
  ) => (
    token: string
  ) => void = (
    rating: Rating
  ) => (
    token: string
  ): void => {

    // Prevent the rating if we don't have a token.
    if (!token) {
      return;
    }

    // Retrieve the xsrf token if it exists.
    const cookies: Cookies = new Cookies();
    const xsrf: string = cookies.get('XSRF-TOKEN');

    // Perform the API request to get the user's profile.
    API.requestAPI<RatingResponse>(`statistics/review/rate/${token}`, {
      headers: {
        'x-xsrf-token': xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        rating: rating
      })
    })
    .then((response: RatingResponse) => {
      if (response.results) {
        setRatingResults({
          up: NumericSuffix(parseInt(response.results.up || '0'))(1),
          down: NumericSuffix(parseInt(response.results.down || '0'))(1),
          userRating: response.results.userRating
        });
      }
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

  return {
    ratingResults,
    rate,
    retrieved,
    setRatingResults
  };
}

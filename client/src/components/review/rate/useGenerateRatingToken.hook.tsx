
/**
 * useGenerateRatingToken.hook.ts
 * Creates a rating token.
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

// Interfaces.
import {
  RatingTokenResponse,
  RatingTokenParams
} from './Rate.interface';

/**
 * Creates a rating token.
 */
export function useGenerateRatingToken() {

  // Define the token to be created for ratings.
  const [token, setToken] = React.useState<string>('');

  /**
   * Performs an api request to generate and set a token.
   */
  const generateToken: (
    reviewId: string
  ) => (
    duration: number
  ) => void = (
    reviewId: string
  ) => (
    duration: number
  ): void => {
    // Retrieve the xsrf token if it exists.
    const cookies: Cookies = new Cookies();
    const xsrf: string = cookies.get('XSRF-TOKEN');

    // Perform the API request to get the user's profile.
    API.requestAPI<RatingTokenResponse>(`statistics/review/rate`, {
      headers: {
        'x-xsrf-token': xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        reviewId: reviewId,
        duration: duration
      })
    })
    .then((response: RatingTokenResponse) => {
      if (response.token) {
        setToken(response.token);
      }
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

  return {
    token,
    generateToken
  };
}

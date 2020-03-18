/**
 * useRetrieveProfile.hook.ts
 * Retrieves the profile if we have a valid token.
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
  RetrieveProfileParams,
  ProfileResponse
} from './Profile.interface';
import { PrivateProfile } from '../User.interface';

/**
 * Checks if the profile and cookie are valid.
 *
 * @param { PrivateProfile } profile - the user's profile.
 *
 * @return RetrievalStatus
 */
const setRetrievalStatus: (
  profile: PrivateProfile | undefined
) => (
  addXsrf?: (token: string) => {}
) => RetrievalStatus = (
  profile: PrivateProfile | undefined
) => (
  addXsrf?: (token: string) => {}
): RetrievalStatus => {

  const cookie: Cookies = new Cookies(),
        security: string = cookie.get('XSRF-TOKEN');

  if (profile) {

    if (addXsrf) {
      addXsrf(security);
    }

    return RetrievalStatus.SUCCESS;
  }


  if (security) {
    return RetrievalStatus.REQUESTED;
  } else {
    return RetrievalStatus.NOT_FOUND;
  }

}

/**
 * Returns a profile if it exists.
 */
export function useRetrieveProfile(params: RetrieveProfileParams) {

  // Retrieve the parameters.
  const {
    profile,
    updateProfile,
    updateXsrf
  } = {...params};

  // Check if the current profile exists and contains a valid cookie.
  const [retrieved, setRetrieved] = React.useState(setRetrievalStatus(profile)(updateXsrf)); 

  /**
   * Handle state updates based on the presence of a profile.
   */
  React.useEffect(() => {
    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);

      const cookie: Cookies = new Cookies(),
            security: string = cookie.get('XSRF-TOKEN');

      // Perform the API request to get the user's profile.
      API.requestAPI<ProfileResponse>('user/profile', {
        method: RequestType.GET,
        headers: {
          'x-xsrf-token': security
        }
      })
      .then((response: ProfileResponse) => {
        if (updateProfile) {
          setRetrieved(RetrievalStatus.SUCCESS);
          updateProfile(response.user);

          // Add the xsrf token.
          if (updateXsrf) {
            updateXsrf(security);
          }

        } else {
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        setRetrieved(RetrievalStatus.FAILED);
      });
      
      // Update the user's profile in the redux store.
    }
  }, [profile, setRetrieved]);

  return {
    profileStatus: retrieved
  }
}

/**
 * useFollow.hook.ts
 * Handles common functions for following items.
 */

// Modules.
import API from '../../utils/api/Api.model';
import Cookies from 'universal-cookie';
import * as React from 'react';

// Enumerators.
import {
  FollowType
} from './FollowType.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';

// Hooks.
import { useIsMounted } from '../../utils/safety/useIsMounted.hook';

// Interfaces.
import {
  Following,
  FollowParams,
  FollowResponse
} from './Follow.interface';
import {
  PrivateProfile
} from '../user/User.interface';

/**
 * Checks if the id exists in the list of followed ids.
 *
 * @param { string } id - the id of the item to be followed.
 * @param { Array<string> } list - the list of currently followed items.
 *
 * @return boolean
 */
const isFollowing: (
  id: string
) => (
  followType: FollowType
) => (
  following?: Following
) => boolean = (
  id: string
) => (
  followType: FollowType
) => (
  following?: Following
): boolean => {
  let isFollowing: boolean = false;

  if (!following) {
    return isFollowing;
  }

  // Update the isFollowing flag based on finding the id in the existing
  // list of followed items.
  switch (followType) {
    case FollowType.CHANNEL:
      isFollowing = following.channels.indexOf(id) >= 0;
      break;
    default:
  }

  return isFollowing;
}

/**
 * Follow hook to handle state updates.
 */
export function useFollow(params: FollowParams) {

  const {id, followType, profile, updateProfile} = {...params};

  const [follows, setFollows] = React.useState<Following | null>(profile ? profile.following : null);

  const [following, setFollowing] = React.useState<boolean>(isFollowing(id)(followType)(profile ? profile.following : undefined));

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // If the profile hasn't loaded yet, update it when it's available.
  React.useEffect(() => {
    if (!follows && profile) {
      setFollows(profile.following);
      setFollowing(isFollowing(id)(followType)(profile.following));
    };
  }, [follows, profile]);

  /**
   * Update the following state if the user profile is updated.
   */

  /**
   * Performs the request to update the follows state for this item.
   */
  const updateFollowState: (
  ) => void = (
  ): void => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    // Retrieve the xsrf token if it exists.
    const cookies: Cookies = new Cookies();
    const xsrf: string = cookies.get('XSRF-TOKEN');

    // Perform the API request to follow.
    API.requestAPI<FollowResponse>(`follow/${followType}/${id}`, {
      headers: {
        'x-xsrf-token': xsrf || ''
      },
      method: RequestType.GET,
    })
    .then((response: FollowResponse) => {
      if (response.following) {
        const updatedState: boolean = isFollowing(id)(followType)(response.following);

        setFollowing(updatedState);

        setSubmitting(false);

        if (profile) {
          // Update the user's profile to reflect the changes.
          const updatedProfile: PrivateProfile = {
            ...profile,
            following: {...response.following}
          };

          if (updateProfile) {
            updateProfile(updatedProfile);
          }
        }
      }
    })
    .catch((error: Error) => {
      console.log(error);
      setSubmitting(false);
    });
  }

  return {
    following,
    setFollowing,
    submitting,
    updateFollowState
  }
}

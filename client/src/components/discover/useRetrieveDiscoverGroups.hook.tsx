/**
 * useRetrieveDiscoverGroups.hook.ts
 * Retrieves the discover goups.
 */

// Modules.
import API from '../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';

// Interfaces.
import {
  DiscoverGroup,
  DiscoverGroupsResponse,
  DiscoverSubGroup,
  DiscoverProductGroup,
  RetrieveDiscoverGroupsParams
} from './Discover.interface';
import {
  Review,
  ReviewList
} from '../review/Review.interface';

/**
 * Formats the reviews into logical structures.
 *
 * @param { Array<DiscoverGroup> } discoverGroups - the list of review groups.
 *
 * @return Array<ReviewGroup>
 */
const createReviewLists: (
  discoverGroups: Array<DiscoverGroup>
) => Array<ReviewList> = (
  discoverGroups: Array<DiscoverGroup>
): Array<ReviewList> => {
  const lists: Array<ReviewList> = [];

  if (discoverGroups.length <= 0 || !discoverGroups[0].category.key) {
    return lists;
  }

  // Loop through the lists and create top level category groups.
  let i: number = 0;

  do {
    const currentGroup: DiscoverGroup = {...discoverGroups[i]};

    let j: number = 0;

    const reviews: Array<Review> = [];

    do {
      const currentSubGroup: DiscoverSubGroup = {...currentGroup.items[j]};

      let k: number = 0;

      do {
        const currentProductGroup: DiscoverProductGroup = {...currentSubGroup.items[k]};

        reviews.push(...currentProductGroup.reviews); 

        k++;
      } while (k < currentSubGroup.items.length)

      j++;
    } while (j < currentGroup.items.length);

    lists.push({
      id: currentGroup.category.key,
      reviews: reviews,
      title: currentGroup.category.label,
      url: `/categories/${currentGroup.category.key}`
    })

    i++;
  } while (i < discoverGroups.length);

  return lists;
}

/**
 * Returns a product if it exists.
 */
export function useRetrieveDiscoverGroups(params: RetrieveDiscoverGroupsParams) {

  // Retrieve the product id from the match url provided.
  const {
    term,
    existing,
    updateGroups
  } = {...params};

  // Define the product to be used for view rendering.
  const [lists, setLists] = React.useState<Array<ReviewList>|null>(
    existing.length > 0 && existing[0].category.key
      ? createReviewLists(existing)
      : null
    );

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Store the requested search term so we can use it to perform subsequent
  // requests when it changes.
  const [requestedTerm, setRequestedTerm] = React.useState<string>(term);

  const [loading, setLoading] = React.useState<boolean>(true);

  /**
   * Handle state updates to the requested search term.
   */
  React.useEffect(() => {
    if (term !== requestedTerm || !lists) {
      setLoading(true);
      setRetrieved(RetrievalStatus.REQUESTED);
      setRequestedTerm(term);
    }
  }, [lists, term, requestedTerm]);

  /**
   * Handle state updates based on the requested state.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile.
      API.requestAPI<DiscoverGroupsResponse>(`search/discover/${requestedTerm}`, {
        method: RequestType.GET
      })
      .then((response: DiscoverGroupsResponse) => {
        // Set the product and update the retrieval state.
        if (response.groups) {
          if (updateGroups) {
            const reviewLists: Array<ReviewList> = createReviewLists([...response.groups]);
            setLists([...reviewLists]);
            updateGroups([...response.groups]);
          }
          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          // We couldn't find the product so return an appropriate response
          // for the view to render accordingly.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
        setLoading(false);
      })
      .catch((error: Error) => {
        console.error(error);
        setRetrieved(RetrievalStatus.FAILED);
        setLoading(false);
      });
    }
  }, [retrieved]);

  return {
    lists,
    loading,
    retrievalStatus: retrieved
  }
}

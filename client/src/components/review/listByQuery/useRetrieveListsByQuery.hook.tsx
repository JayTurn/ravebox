/**
 * useRetrieveListByQuery.hook.ts
 * Retrieves groups of reviews based on an array of queries provided.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import {
  QueryPath,
  ReviewListType
} from './ListByQuery.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Hooks.
import { useIsMounted } from '../../../utils/safety/useIsMounted.hook';

// Interfaces.
import {
  RetrieveListByQueryParams,
  RetrieveListByQueryResponse,
} from './ListByQuery.interface';
import {
  Review,
  ReviewGroup
} from '../Review.interface';

/**
 * Builds the query based on the list type requested.
 *
 * @param { ReviewListType } listType - the type of list to be queried.
 */
const setQueryListPath: (
  listType: ReviewListType
) => string = (
  listType: ReviewListType
): string => {
  let path: string = '';

  switch (listType) {
    case ReviewListType.PRODUCT:
      path = `${QueryPath.PRODUCT}`;
      break;
    case ReviewListType.CATEGORY:
      path = `${QueryPath.CATEGORY}`;
    default:
  }

  return path;
}

/**
 * Removes the currrent review from the list if it's present.
 *
 * @param { Review } active - the currently active review.
 * @param { Array<Review> } reviews - the list of reviews.
 *
 * @param Array<Review>
 */
const removeActiveReview: (
  active: Review
) => (
  reviews: Array<Review>
) => Array<Review> = (
  active: Review
) => (
  reviews: Array<Review>
): Array<Review> => {
  const list: Array<Review> = [];

  let i: number = 0;

  do {
    const current: Review = {...reviews[i]};

    if (current._id !== active._id) {
      list.push({...current});
    }

    i++;
  } while (i < reviews.length);

  return list;
}

/**
 * Returns lists of reviews based on an array of queries.
 */
export function useRetrieveListByQuery(params: RetrieveListByQueryParams) {

  // Queries can contain an array of descriptors or ids for queriying lists
  // of reviews.
  const { queries, listType, update } = {...params};

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Define the retrieval status to be used for rating requests.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED);

  /**
   * Handle state updates based on the retrieval status.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Set the query path to be requested.
      const path: string = setQueryListPath(listType);

      // Perform the API request to get the review group.
      API.requestAPI<RetrieveListByQueryResponse>(path, {
        method: RequestType.POST,
        body: JSON.stringify({
          queries: queries
        })
      })
      .then((response: RetrieveListByQueryResponse) => {
        if (response.reviews && update) {
          if (isMounted.current) {
            update(response.reviews);
            setRetrieved(RetrievalStatus.SUCCESS);
          }
        } else {
          // We couldn't find the review groups so return an appropriate
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
  }, [queries, listType]);

  return {
    retrievalStatus: retrieved
  };
}

/**
 * useRetrieveReviewByURL.hook.ts
 * Retrieves the review if we have a valid url.
 */

// Modules.
import API from '../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';
import {
  Recommended
} from './recommendation/Recommendation.enum';

// Interfaces.
import {
  Review,
  RetrieveReviewParams,
  ReviewResponse,
  RetrieveReviewByURLParams
} from './Review.interface';

/**
 * Builds the requested path from the parameters provided.
 *
 * @param { RetrieveReviewByURLParams } requested - the requested path params.
 */
const constructRequestPath: (
  requested: RetrieveReviewByURLParams
) => string = (
  requested: RetrieveReviewByURLParams
): string => {
  
  // Retrieve the paramaters and return the constructed path..
  const { brand, productName, reviewTitle } = {...requested};
  return `${brand}/${productName}/${reviewTitle}`;
}

/**
 * Sets the default retrieval status.
 *
 * @param { string } id - the review id.
 *
 * @return RetrievalStatus
 */
const setDefaultRetrievalStatus: (
  requested: RetrieveReviewByURLParams
) => (
  existing: string 
) => RetrievalStatus = (
  requested: RetrieveReviewByURLParams
) => (
  existing: string 
): RetrievalStatus => {

  // Build the requested path.
  const requestedPath: string = constructRequestPath({...requested});

  if (requestedPath === existing) {
    return RetrievalStatus.SUCCESS;
  }

  return RetrievalStatus.REQUESTED;
}

/**
 * Returns a review if it exists.
 */
export function useRetrieveReviewByURL(params: RetrieveReviewParams) {

  // Retrieve the review params from the match url provided.
  const {
    existing,
    requested,
    review,
    setReview
  } = {...params};

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 
  const [requestPath, setRequestPath] = React.useState<string>(constructRequestPath({...requested}));

  const newPath: string = constructRequestPath({...requested});

  /**
   * Handle state updates based on the presence of a review.
   */
  React.useEffect(() => {
    

    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {

      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      const { brand, productName, reviewTitle } = {...requested};
      const path: string = `${brand}/${productName}/${reviewTitle}`;

      // Perform the API request to get the user's profile.
      API.requestAPI<ReviewResponse>(`review/view/${path}`, {
        method: RequestType.GET
      })
      .then((response: ReviewResponse) => {
        // Set the review and update the retrieval state.
        if (setReview) {
          setReview(response.review);
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
    } else {
      if (retrieved !== RetrievalStatus.WAITING) {
        if (newPath !== requestPath) {
          setRetrieved(RetrievalStatus.REQUESTED);
          setRequestPath(newPath);
        }
      } 
    }
  }, [newPath, retrieved, requestPath]);

  return {
    review: review,
    reviewStatus: retrieved
  }
}

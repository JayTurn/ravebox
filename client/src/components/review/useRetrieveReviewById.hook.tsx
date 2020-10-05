/**
 * useRetrieveReviewById.hook.ts
 * Retrieves the review if we have a valid id.
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
import { VideoType } from './Review.enum';

// Interfaces.
import {
  Review,
  ReviewResponse,
  RetrieveReviewByIdParams
} from './Review.interface';

/**
 * Sets the default retrieval status.
 *
 * @param { string } id - the review id.
 *
 * @return RetrievalStatus
 */
const setDefaultRetrievalStatus: (
  id: string
) => RetrievalStatus = (
  id: string
): RetrievalStatus => {

  // Set the default retrieval status.
  let retrievalStatus: RetrievalStatus = RetrievalStatus.REQUESTED;

  // If we don't have an id, set the status as failed so we don't attempt
  // to perform an API request.
  if (!id) {
    retrievalStatus = RetrievalStatus.FAILED;
  }

  return retrievalStatus;
}

/**
 * Returns a review if it exists.
 */
export function useRetrieveReviewById(params: RetrieveReviewByIdParams) {

  // Retrieve the review id from the match url provided.
  const id: string = params.id,
        xsrf: string | undefined = params.xsrf;

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(setDefaultRetrievalStatus(id)); 

  // Define the review to be used for view rendering.
  const [review, setReview] = React.useState<Review>({
    created: new Date(),
    description: '',
    endTime: 0,
    _id: '',
    links: [],
    sponsored: false,
    startTime: 0,
    title: '',
    recommended: Recommended.RECOMMENDED,
    url: '',
    videoType: VideoType.NATIVE
  });

  /**
   * Handle state updates based on the presence of a review.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED && xsrf) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's review.
      API.requestAPI<ReviewResponse>(`review/edit/${id}`, {
        headers: {
          'x-xsrf-token': xsrf || ''
        },
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
    }
  }, [retrieved, review, xsrf]);

  return {
    review: review,
    reviewStatus: retrieved
  }
}

/**
 * Following.interface.tsx
 * Interfaces for the user's followed reviews.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Review } from '../../../components/review/Review.interface';

/**
 * Properties for the user's followed reviews.
 */
export interface FollowingProps extends RouteComponentProps {
  xsrf?: string;
}

/**
 * Parameters used with the useRetrieveFollowing hook.
 */
export interface RetrieveFollowingParams {
}

/**
 * Response for retrieving the followed reviews.
 */
export interface RetrieveFollowingResponse extends APIResponse {
  reviews: Array<Review>;
}

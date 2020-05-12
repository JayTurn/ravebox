/**
 * ListByQuery.interface.tsx
 * List of reviews based on query.
 */

// Enumerators.
import {
  PresentationType,
  QueryPath,
  ReviewListType
} from './ListByQuery.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import {
  Review,
  ReviewGroup
} from '../Review.interface';

/**
 * Properties for the list of reviews by query request.
 */
export interface ListByQueryProps {
  activeReview?: Review;
  listType: ReviewListType;
  presentationType?: PresentationType;
  reviews: Array<Review>;
  title?: React.ReactElement;
}

/**
 * Response for the query.
 */
export interface RetrieveListByQueryResponse extends APIResponse {
  reviews: ReviewGroup;
}

/**
 * Parameters to be provided for querying lists of reviews.
 */
export interface RetrieveListByQueryParams {
  queries: Array<string>;
  listType: ReviewListType;
  update?: (reviews: ReviewGroup) => void;
}

/**
 * Filters for queries.
 */
export interface ListQueryFilters {
  unqiue?: boolean;
}

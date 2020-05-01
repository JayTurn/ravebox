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
import { Review } from '../Review.interface';

/**
 * Properties for the list of reviews by query request.
 */
export interface ListByQueryProps {
  listByProduct?: Array<Review>;
  listType: ReviewListType;
  query: string;
  presentationType?: PresentationType;
  title?: React.ReactElement;
  updateListByProduct?: (reviews: Array<Review>) => void;
}

/**
 * Response for the query.
 */
export interface ListByQueryResponse extends APIResponse {
  reviews: Array<Review>;
}

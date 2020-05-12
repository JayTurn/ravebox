/**
 * Interfaces for the review store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import {
  Review,
  ReviewGroup
} from '../../components/review/Review.interface';

/**
 * Redux review action type.
 */
export type ReviewAction = ActionType<typeof actions>;

/**
 * User store interface.
 */
export interface ReviewStore {
  active: Review;
  listByProduct: ReviewGroup;
  listByCategory: ReviewGroup;
}

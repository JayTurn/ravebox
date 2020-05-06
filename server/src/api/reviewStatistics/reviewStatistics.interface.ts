/**
 * reviewAnalytics.interface.tsx
 * Interfaces for the review analytics.
 *
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import {
  RatingOptions,
} from './reviewStatistics.enum';
import { UserType } from '../user/user.enum';

/**
 * Review statistics document model interface.
 */
export interface ReviewStatisticsDocument extends Mongoose.Document {
  details: ReviewStatistics;
  ratings: ReviewRatings;
  review: string;
  views: number;
}

/**
 * Review stastics model.
 */
export interface ReviewStatistics {
  views: number;
  ratings: ReviewRatings;
}

/**
 * Review ratings.
 */
export interface ReviewRatings {
  up: number;
  down: number;
  userRating?: RatingOptions;
}

/**
 * Rating interface.
 */
export interface Rating {
  rate: RatingOptions;
  rated: Date;
  user?: string;
  userType: UserType;
}

/**
 * Review increment query.
 */
export interface ReviewIncrementQuery {
  $inc?: Record<string, number>;
  $dec?: Record<string, number>;
}

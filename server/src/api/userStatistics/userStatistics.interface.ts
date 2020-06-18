/**
 * userStatistics.interface.tsx
 * Interfaces for the user statistics.
 *
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import {
  RatingOptions,
} from '../reviewStatistics/reviewStatistics.enum';

/**
 * User statistics document model interface.
 */
export interface UserStatisticsDocument extends Mongoose.Document {
  followers: number;
  user: string;
  reviews: Array<Reviewed>;
}

/**
 * User statistics.
 */
export interface UserStatistics {
  followers: number;
  user: string;
  reviews: Array<Reviewed>;
}

/**
 * Review ratings.
 */
export interface Reviewed {
  review: string;
  rating?: RatingOptions;
  watchPercentage?: number;
  watchSeconds?: number;
  watchCount: number;
}

/**
 * Public profile statistics.
 */
export interface ProfileStatistics {
  ravesCount: number;
}

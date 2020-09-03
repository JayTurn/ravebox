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
  invited?: Array<string>;
  ravesCount: number;
  reviews: Array<Reviewed>;
  user: string;
}

/**
 * User statistics.
 */
export interface UserStatistics {
  followers: number;
  invited?: Array<string>;
  ravesCount: number;
  reviews: Array<Reviewed>;
  user: string;
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

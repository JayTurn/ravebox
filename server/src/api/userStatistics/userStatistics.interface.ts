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
  details: UserStatisticsDetails;
  followers: number;
  invited?: Array<Mongoose.Types.ObjectId>;
  ravesCount: number;
  reviews: Array<Reviewed>;
  user: Mongoose.Types.ObjectId;
}

/**
 * Public user statistics.
 */
export interface PublicUserStatisticsDetails {
  followers: number;
  ravesCount: number;
}

/**
 * User statistics.
 */
export interface UserStatisticsDetails {
  _id: Mongoose.Types.ObjectId;
  followers: number;
  invited?: Array<Mongoose.Types.ObjectId>;
  ravesCount: number;
  reviews: Array<Reviewed>;
  user: Mongoose.Types.ObjectId;
}

/**
 * Review ratings.
 */
export interface Reviewed {
  review: Mongoose.Types.ObjectId;
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

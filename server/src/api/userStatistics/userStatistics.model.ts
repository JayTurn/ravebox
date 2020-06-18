/**
 * userStatistics.model.js
 * userStatistics model for user activity.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  UserStatisticsDocument
} from './userStatistics.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the user statistics schema to be the base for the model.
const UserStatisticsSchema = new Schema<UserStatisticsDocument>({
  followers: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Array
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

UserStatisticsSchema.index({'user': 1, 'reviewRatings.review': 1});

const UserStatistics: Mongoose.Model<UserStatisticsDocument> = Mongoose.model('UserStatistic', UserStatisticsSchema);

// Declare the user statistics mongoose model.
export default UserStatistics;

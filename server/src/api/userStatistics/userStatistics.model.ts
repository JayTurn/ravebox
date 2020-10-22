/**
 * userStatistics.model.js
 * userStatistics model for user activity.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  Reviewed,
  UserStatisticsDetails,
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
  invited: {
    type: Array,
    default: []
  },
  ravesCount: {
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

// Define a structure to be used for public details.
UserStatisticsSchema
  .virtual('details')
  .get(function() {
    const userStatistics: UserStatisticsDetails = {
      _id: this._id as Mongoose.Types.ObjectId,
      followers: this.followers as number,
      ravesCount: this.ravesCount as number,
      reviews: this.reviews as Array<Reviewed>,
      user: this.user as Mongoose.Types.ObjectId
    }

    if (this.invited) {
      userStatistics.invited = this.invited as Array<Mongoose.Types.ObjectId>;
    }

    return userStatistics;
  });

const UserStatistics: Mongoose.Model<UserStatisticsDocument> = Mongoose.model('UserStatistic', UserStatisticsSchema);

// Declare the user statistics mongoose model.
export default UserStatistics;

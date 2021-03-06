/**
 * reviewStatistics.model.js
 * Statistics model for reviews.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  ReviewStatisticsDocument
} from './reviewStatistics.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the review statistics schema to be the base for the model.
const ReviewStatisticsSchema = new Schema<ReviewStatisticsDocument>({
  views: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Object,
    default: {
      up: 0,
      down: 0
    }
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: 'Review'
  },
  score: {
    type: Number,
    default: 0
  }
});

ReviewStatisticsSchema.index({'review': 1, 'ratings.user': 1});

// Define a structure to be used for public details.
ReviewStatisticsSchema
  .virtual('details')
  .get(function() {
    return {
      'ratings': {
        'down': this.ratings ? this.ratings.down : 0,
        'up': this.ratings ? this.ratings.up : 0
      },
      'score': this.score ? this.score : 0,
      'views': this.views
    };
  });

const ReviewStatistics: Mongoose.Model<ReviewStatisticsDocument> = Mongoose.model('ReviewStatistic', ReviewStatisticsSchema);

// Declare the review statistics mongoose model.
export default ReviewStatistics;

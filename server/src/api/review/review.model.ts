/**
 * review.model.js
 * Review model to manage the review storage.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { Recommended } from './review.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import { ReviewDocument } from './review.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the review schema to be the base for the review model.
const ReviewSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  product:  { 
    type: Schema.Types.ObjectId, 
    ref: 'Product'
  },
  published: {
    type: Workflow
  },
  recommended: {
    type: Recommended
  },
  title: {
    type: String
  },
  user:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  videoURL: {
    type: String
  }
});

// Define a view to be used for product responses.
ReviewSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'product': this.product,
      'recommended': this.recommended,
      'title': this.title,
      'user': this.user,
      'videoURL': this.videoURL
    };
  });

// Declare the review mongoose model.
const Review: Mongoose.Model<ReviewDocument> = Mongoose.model('Review', ReviewSchema);

// Declare the User mongoose model.
export default Review;

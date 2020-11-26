/**
 * review.model.js
 * Review model to manage the review storage.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import {
  Recommended,
  VideoType
} from './review.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  ReviewDetails,
  ReviewDocument
} from './review.interface';
import {
  ProductDetails
} from '../product/product.interface';
import {
  PublicUserDetails
} from '../user/user.interface';

// Models.
import ProductCommon from '../product/product.common';
import ReviewCommon from './review.common';
import ReviewStatisticsCommon from '../reviewStatistics/reviewStatistics.common';
import UserCommon from '../user/user.common';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the review schema to be the base for the review model.
const ReviewSchema = new Schema<ReviewDocument>({
  created: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  },
  product:  { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    index: true
  },
  published: {
    type: Workflow,
    default: Workflow.DRAFT,
    index: true
  },
  recommended: {
    type: Recommended
  },
  score: {
    type: Number,
    default: 50
  },
  statistics: {
    type: Schema.Types.ObjectId, 
    ref: 'ReviewStatistic'
  },
  sponsored: {
    type: Boolean,
    default: false
  },
  links: {
    type: Array
  },
  thumbnail: {
    type: String
  },
  thumbnails: {
    type: Array
  },
  title: {
    type: String
  },
  titleRaw: {
    type: String
  },
  url: {
    type: String,
    index: true
  },
  user:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  video: {
    type: Object
  },
  videoType: {
    type: VideoType,
    default: VideoType.NATIVE
  },
  youtube: {
    type: Object
  }
});

/**
 * Pre-Save hook to set a custom url before saving.
 */
ReviewSchema
  .pre<ReviewDocument>('save', async function(next: Mongoose.HookNextFunction) {

    await ReviewCommon.UpdateReviewURL(this);

    next();
  });

/**
 * Pre-FindOneAndUpdate hook to set a custom url before updating.
 */
ReviewSchema
  .pre<ReviewDocument>('updateOne', async function(next: Mongoose.HookNextFunction) {

    await ReviewCommon.UpdateReviewURL(this);

    next();
  });

// Define a structure to be used for public responses.
ReviewSchema
  .virtual('details')
  .get(function() {

    let endTime = 0, 
        startTime = 0,
        thumbnailURL = '',
        videoHeight = 0,
        videoURL = '',
        videoWidth = 0;

    if (this.videoType === VideoType.YOUTUBE) {
      if (this.youtube) {
        endTime = this.youtube.endTime;
        startTime = this.youtube.startTime;
        videoURL = this.youtube.url; 
      }
    } else {
      if (this.video && this.video.egressEndpoints) {
        videoURL = this.video.egressEndpoints.HLS;
        videoHeight = this.video.srcHeight;
        videoWidth = this.video.srcWidth;
      }
    }

    if (this.thumbnail) {
      thumbnailURL = this.thumbnail;
    } else {
      if (this.thumbnails && this.thumbnails.length > 0) {
        thumbnailURL = this.thumbnails[0];
      }
    }

    // Load the product details.
    const product: ProductDetails = ProductCommon
      .RetrieveDetailsFromDocument(this.product);

    // Load the user details.
    const user: PublicUserDetails = UserCommon.RetrievePublicDetailsFromDocument(this.user);

    // Updated the statistics
    if (user.statistics) {
      user.statistics = {
        followers: user.statistics.followers,
        ravesCount: user.statistics.ravesCount
      };
    }

    const review: ReviewDetails = {
      _id: this._id,
      created: this.created,
      endTime: endTime,
      product: product,
      recommended: this.recommended,
      sponsored: this.sponsored,
      startTime: startTime,
      thumbnail: thumbnailURL,
      title: this.title,
      url: this.url,
      user: user,
      videoHeight: videoHeight,
      videoType: this.videoType,
      videoURL: videoURL,
      videoWidth: videoWidth,
    }

    if (this.description) {
      review.description = this.description;
    }

    if (this.links) {
      review.links = this.links;
    }
    if (this.statistics && this.review) {
      // Load the review statistics details.
      review.statistics = ReviewStatisticsCommon
        .RetrieveDetailsFromDocument(this.statistics);
    }

    return review;
  });

// Define a structure to be used for private reviews.
ReviewSchema
  .virtual('privateDetails')
  .get(function() {

    let endTime = 0, 
        startTime = 0,
        thumbnailURL = '',
        videoURL = '';

    if (this.videoType === VideoType.YOUTUBE) {
      if (this.youtube) {
        endTime = this.youtube.endTime;
        startTime = this.youtube.startTime;
        videoURL = this.youtube.url; 
      }
    } else {
      if (this.video && this.video.egressEndpoints) {
        videoURL = this.video.egressEndpoints.HLS;
      }
    }

    if (this.thumbnail) {
      thumbnailURL = this.thumbnail;
    } else {
      if (this.thumbnails && this.thumbnails.length > 0) {
        thumbnailURL = this.thumbnails[0];
      }
    }

    return {
      '_id': this._id,
      'created': this.created,
      'endTime': endTime,
      'published': this.published,
      'product': this.product,
      'recommended': this.recommended,
      'startTime': startTime,
      'thumbnail': thumbnailURL,
      'title': this.title,
      'url': this.url,
      'user': this.user,
      'videoType': this.videoType,
      'videoURL': videoURL
    };
  });

// Declare the review mongoose model.
const Review: Mongoose.Model<ReviewDocument> = Mongoose.model('Review', ReviewSchema);

// Declare the review mongoose model.
export default Review;

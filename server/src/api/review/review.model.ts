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
import {
  ReviewDocument
} from './review.interface';
import { ProductDetailsDocument } from '../product/product.interface';

// Models.
import Product from '../product/product.model';
import ReviewCommon from './review.common';
 
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
    ref: 'Product'
  },
  published: {
    type: Workflow,
    default: Workflow.DRAFT
  },
  recommended: {
    type: Recommended
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
  }
});

/**
 * Pre-Save hook to set a custom url before saving.
 */
ReviewSchema
  .pre<ReviewDocument>('save', function(next: Mongoose.HookNextFunction) {
    let _this: ReviewDocument;

    if (this.product) {
      _this = this;

      // Load the related prouct for this review.
      Product.findById(this.product) 
        .then((product: ProductDetailsDocument) => {

          // Format the url in a structured way to be used when retrieving
          // results.
          _this.url = ReviewCommon.formatReviewURL(
            product.name, product.brand, _this.title);

          next();
        })
        .catch((error: Error) => {
          console.log(error);
          next();
        });
    } else {
      throw new Error(`Product id doesn't exist`);
    }

  });

// Define a structure to be used for public responses.
ReviewSchema
  .virtual('details')
  .get(function() {

    let videoURL = '',
        thumbnailURL = '';

    if (this.video && this.video.egressEndpoints) {
      videoURL = this.video.egressEndpoints.HLS;
    }

    if (this.thumbnail) {
      thumbnailURL = this.thumbnail;
    } else {
      if (this.thumbnails && this.thumbnails.length > 0) {
        thumbnailURL = this.thumbnails[0];
      }
    }

    return {
      'created': this.created,
      'description': this.description,
      '_id': this._id,
      'links': this.links,
      'product': this.product,
      'recommended': this.recommended,
      'sponsored': this.sponsored,
      'thumbnail': thumbnailURL,
      'title': this.title,
      'url': this.url,
      'user': this.user,
      'videoURL': videoURL
    };
  });

// Define a structure to be used for private reviews.
ReviewSchema
  .virtual('privateDetails')
  .get(function() {

    let videoURL = '',
        thumbnailURL = '';

    if (this.video && this.video.egressEndpoints) {
      videoURL = this.video.egressEndpoints.DASH;
    }

    if (this.thumbnail) {
      thumbnailURL = this.thumbnail;
    } else {
      if (this.thumbnails && this.thumbnails.length > 0) {
        thumbnailURL = this.thumbnails[0];
      }
    }

    return {
      'created': this.created,
      '_id': this._id,
      'published': this.published,
      'product': this.product,
      'recommended': this.recommended,
      'thumbnail': thumbnailURL,
      'title': this.title,
      'url': this.url,
      'user': this.user,
      'videoURL': videoURL
    };
  });

// Declare the review mongoose model.
const Review: Mongoose.Model<ReviewDocument> = Mongoose.model('Review', ReviewSchema);

// Declare the review mongoose model.
export default Review;

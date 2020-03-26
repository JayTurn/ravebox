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
import { ProductDetailsDocument } from '../product/product.interface';

// Models.
import Product from '../product/product.model';
 
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
  url: {
    type: String,
    index: true
  },
  user:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
  videoURL: {
    type: String
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
          const productName: string = product.name.split(' ').join('-')
                  .split('&').join('and').toLowerCase(),
                brand: string = encodeURIComponent(product.brand.split(' ').join('-')
                  .split('&').join('and').toLowerCase()),
                reviewTitle: string = encodeURIComponent(_this.title.split(' ').join('-')
                  .split('&').join('and').toLowerCase());

          _this.url = `${brand}/${productName}/${reviewTitle}`;

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

/**
 * product.model.js
 * Product class to manage the product models.
 */

// Modules.
import * as Mongoose from 'mongoose';
import Brand from '../brand/brand.model';

// Interfaces.
import {
  BrandDetails
} from '../brand/brand.interface';
import {
  Category,
  ProductDetailsDocument
} from './product.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the product schema to be the base for the product model.
const ProductSchema = new Schema({
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand'
  },
  brandPartials: {
    type: Array,
    default: [],
    index: true
  },
  categories: {
    type: Array,
    default: []
  },
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
  },
  namePartials: {
    type: Array,
    default: [],
    index: true
  },
  creator:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
  },
  url: {
    type: String,
    index: true,
  }
});

// Define a view to be used for product responses.
ProductSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'brand': this.brand,
      'categories': this.categories,
      'name': this.name,
      'url': this.url
    };
  });

/**
 * Pre-Save hook to set a custom url before saving.
 */
ProductSchema
  .pre<ProductDetailsDocument>('save', function(next: Mongoose.HookNextFunction) {

    Brand.findOne(this.brand)
      .lean()
      .then((brandDetails: BrandDetails) => {
        if (!brandDetails) {
          throw new Error('Brand not found');
        }

        const name: string = this.name.split(' ').join('_')
                .split('&').join('and').toLowerCase();

        const id = this._id.toString();

        const unique: string = id.substring(id.length - 5, id.length - 1);

        this.url = `${brandDetails.url}/${name}/${unique}`;

        next();
      })
      .catch((error: Error) => {
        throw error;
      })

  });

// Declare the product mongoose model.
const Product: Mongoose.Model<ProductDetailsDocument> = Mongoose.model('Product', ProductSchema);

// Declare the User mongoose model.
export default Product;

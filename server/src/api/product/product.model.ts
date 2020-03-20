/**
 * product.model.js
 * Product class to manage the product models.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  ProductDetailsDocument,
  Category
} from './product.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the product schema to be the base for the product model.
const ProductSchema = new Schema({
  brand: {
    type: String
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
    type: String
  },
  creator:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
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
      'name': this.name
    };
  });

// Declare the product mongoose model.
const Product: Mongoose.Model<ProductDetailsDocument> = Mongoose.model('Product', ProductSchema);

// Declare the User mongoose model.
export default Product;

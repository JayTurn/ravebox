/**
 * product.model.js
 * Product class to manage the product models.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import { ProductDetailsDocument } from './product.interface';

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
  color: {
    type: String
  },
  dimensions: {
    type: String
  },
  name: {
    type: String
  },
  rating: {
    type: Number
  },
  reviews: {
    type: Number
  },
  url: {
    type: String
  }
});

// Declare the product mongoose model.
const Product: Mongoose.Model<ProductDetailsDocument> = Mongoose.model('Product', ProductSchema);

// Declare the User mongoose model.
export default Product;

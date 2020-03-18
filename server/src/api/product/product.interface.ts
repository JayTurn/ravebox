/**
 * product.interface.ts
 * Interface for the product details.
 */

// Interfaces.
import * as Mongoose from 'mongoose';

/**
 * Product interface.
 */
export interface ProductDetailsDocument extends Mongoose.Document {
  _id: string;
  brand: string;
  categories: Array<string>;
  creator: string;
  added?: Date;
  name: string;
  reviews?: Array<ProductReview>;
}

export interface ProductDetails {
  brand: string;
  categories: Array<string>;
  name: string;
}

export interface ProductReview {
  user: string;
  score: string;
}

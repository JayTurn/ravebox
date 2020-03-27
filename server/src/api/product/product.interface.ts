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
  categories: Array<Category>;
  creator: string;
  added?: Date;
  name: string;
  reviews?: Array<ProductReview>;
  details: ProductDetails;
  url: string;
}

export interface ProductDetails {
  _id?: string;
  brand: string;
  categories: Array<Category>;
  name: string;
  url: string;
}

export interface ProductReview {
  user: string;
  score: string;
}

export interface Category {
  key: string;
  label: string;
}

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
  added?: Date;
  brand: string;
  brandPartials?: Array<string>;
  categories: Array<Category>;
  categoriesPartials?: Array<string>;
  creator: string;
  details: ProductDetails;
  _id: string;
  name: string;
  namePartials?: Array<string>;
  reviews?: Array<ProductReview>;
  synchronize: Function;
  url: string;
}

export interface ProductDetails {
  _id?: string;
  brand: string;
  brandPartials?: Array<string>;
  categories: Array<Category>;
  categoriesPartials?: Array<string>;
  name: string;
  namePartials?: Array<string>;
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

/**
 * product.interface.ts
 * Interface for the product details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import { TagDetails } from '../tag/tag.interface';

/**
 * Product interface.
 */
export interface ProductDetailsDocument extends Mongoose.Document {
  added?: Date;
  brand: string;
  brandPartials?: Array<string>;
  category: string;
  categories: Array<Category>;
  categoriesPartials?: Array<string>;
  competitors: Array<string>;
  complentary: Array<string>;
  creator: string;
  description: string;
  details: ProductDetails;
  _id: string;
  name: string;
  namePartials?: Array<string>;
  productType: string;
  reviews?: Array<ProductReview>;
  synchronize: Function;
  tags: Array<string>;
  url: string;
}

export interface ProductDetails {
  _id?: string;
  brand: string;
  brandPartials?: Array<string>;
  category: string;
  categories: Array<Category>;
  categoriesPartials?: Array<string>;
  competitors: Array<string>;
  complementary: Array<string>;
  description: string;
  name: string;
  namePartials?: Array<string>;
  productType: TagDetails;
  tags: Array<TagDetails>;
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

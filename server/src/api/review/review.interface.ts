/**
 * review.interface.ts
 * Interface for the reviews.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { Recommended } from './review.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  ProductDetails,
  ProductDetailsDocument
} from '../product/product.interface';
import {
  UserDetailsDocument
} from '../user/user.interface';

/**
 * Review document interface.
 */
export interface ReviewDocument extends Mongoose.Document {
  _id: string;
  created: Date;
  product: ProductDetailsDocument;
  published: Workflow;
  recommended: Recommended;
  title: string;
  user: UserDetailsDocument;
  details: ReviewDetails;
  url: string;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  _id: string;
  product: ProductDetails;
  recommended: Recommended;
  title: string;
  videoURL: boolean;
}

/**
 * Review request body interface.
 */
export interface ReviewRequestBody {
  product: string;
  recommended: Recommended;
  title: string;
  videoTitle: string;
  videoSize: string;
  videoType: string;
}


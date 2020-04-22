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
import { VideoPaths } from '../../shared/video/Video.interface';

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
  privateDetails: PrivateReviewDetails;
  url: string;
  videoPaths: VideoPaths;
  thumbnails: Array<string>;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  created: Date;
  _id: string;
  product: ProductDetails;
  recommended: Recommended;
  title: string;
  videoURL: string;
  thumbnail: string;
}

/**
 * Private review interface.
 */
export interface PrivateReviewDetails extends ReviewDetails {
  published: Workflow;
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

/**
 * SNS Notification message.
 */
export interface ReviewPublishedSNS {
  workflowStatus: string;
  reviewId: string;
  videoPaths: VideoPaths;
  thumbnailUrls: Array<string>;
  errorCode?: string;
}

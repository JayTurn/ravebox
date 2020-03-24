/**
 * review.interface.ts
 * Interface for the reviews.
 */

// Enumerators.
import { Recommended } from './review.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import * as Mongoose from 'mongoose';

/**
 * Review document interface.
 */
export interface ReviewDocument extends Mongoose.Document {
  _id: string;
  created: Date;
  product: string;
  published: Workflow;
  recommended: Recommended;
  title: string;
  user: string;
  details: ReviewDetails;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  _id: string;
  product: string;
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


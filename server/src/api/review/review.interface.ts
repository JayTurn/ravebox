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
  videoURL?: string;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  title: string;
  recommended: Recommended;
  videoURL?: string;
}

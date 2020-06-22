/**
 * follow.interface.ts
 * Interface for the follow details.
 */

// Interfaces.
import * as Mongoose from 'mongoose';

/**
 * Follow interface.
 */
export interface FollowDocument extends Mongoose.Document {
  channels: Array<string>;
  _id: string;
  user: string;
  details: Following;
}

/**
 * Follow model.
 */
export interface Following {
  _id: string;
  channels: Array<string>;
}

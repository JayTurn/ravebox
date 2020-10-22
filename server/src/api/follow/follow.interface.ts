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
  _id: Mongoose.Types.ObjectId;
  channels: Array<Mongoose.Types.ObjectId>;
  user: Mongoose.Types.ObjectId;
  details: Following;
}

/**
 * Follow model.
 */
export interface Following {
  _id: Mongoose.Types.ObjectId;
  channels: Array<Mongoose.Types.ObjectId>;
}

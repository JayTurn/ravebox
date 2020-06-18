/**
 * follow.model.js
 * Follow model.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  FollowDocument
} from './follow.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the follow schema to be the base for the follow model.
const FollowSchema = new Schema({
  channels: {
    type: [Schema.Types.ObjectId],
    ref: 'User'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
});

// Define a structure to be used for public display.
FollowSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'channels': this.channels
    };
  });

// Declare the follow mongoose model.
const Follow: Mongoose.Model<FollowDocument> = Mongoose.model('Follow', FollowSchema);

// Declare the Follow mongoose model.
export default Follow;

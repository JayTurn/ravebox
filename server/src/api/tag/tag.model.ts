/**
 * tag.model.js
 * Tag model.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import {
  TagAssociation,
  TagStatus
} from './tag.enum';

// Interfaces.
import {
  TagDetailsDocument
} from './tag.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the tag Schema to be the base for the Tag model.
const TagSchema = new Schema({
  association: {
    type: TagAssociation,
    default: TagAssociation.PRODUCT,
    index: true
  },
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag' 
  }],
  context: {
    type: String,
    default: ''
  },
  labels: {
    type: Array,
    default: []
  },
  name: {
    type: String,
    default: ''
  },
  partials: {
    type: [String],
    default: [],
    index: true
  },
  status: {
    type: TagStatus,
    default: TagStatus.DRAFT
  }
});

// Define a view to be used for light tag responses.
TagSchema
  .virtual('light')
  .get(function() {
    return {
      '_id': this._id,
      'association': this.association,
      'name': this.name,
      'context': this.context
    };
  });

// Define a view to be used for tag responses.
TagSchema
  .virtual('full')
  .get(function() {
    return {
      '_id': this._id,
      'association': this.association,
      'name': this.name,
      'context': this.context,
      'children': this.children
    };
  });

// Declare the tag mongoose model.
const Tag: Mongoose.Model<TagDetailsDocument> = Mongoose.model('Tag', TagSchema);

// Declare the Tag mongoose model.
export default Tag;

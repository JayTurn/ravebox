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
  TagDocument
} from './tag.interface';

// Models.
import TagCommon from '../tag/tag.common';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the tag Schema to be the base for the Tag model.
const TagSchema = new Schema({
  association: {
    type: TagAssociation,
    default: TagAssociation.PRODUCT,
    index: true
  },
  linkFrom: [{
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
  nameRaw: {
    type: String,
  },
  namePartials: {
    type: [String],
    default: [],
    index: true
  },
  status: {
    type: TagStatus,
    default: TagStatus.DRAFT
  },
  url: {
    type: String,
    default: '',
    index: true
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
      'context': this.context,
      'url': this.url
    };
  });

// Define a view to be used for tag responses.
TagSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'association': this.association,
      'name': this.name,
      'context': this.context,
      'linkFrom': this.linkFrom,
      'url': this.url
    };
  });

/**
 * Pre-Save hook to set a custom url before saving.
 */
TagSchema
  .pre<TagDocument>('save', async function(next: Mongoose.HookNextFunction) {

    await TagCommon.UpdateDocumentURL(this);

    next();
  });

// Declare the tag mongoose model.
const Tag: Mongoose.Model<TagDocument> = Mongoose.model('Tag', TagSchema);

// Declare the Tag mongoose model.
export default Tag;

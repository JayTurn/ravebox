/**
 * collection.model.js
 * Collection class to manage the product group models.
 */

// Modules.
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as Mongoose from 'mongoose';

// Enumerators.
import { CollectionContext } from './collection.enum';

// Interfaces.
import {
  CollectionDetailsDocument
} from './collection.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the collection schema to be the base for the collection model.
const CollectionSchema = new Schema({
  context: {
    type: CollectionContext,
    default: CollectionContext.COMPETING,
    index: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    default: EnvConfig.admin
  },
  products: {
    type: [Schema.Types.ObjectId],
    ref: 'Product',
    default: [],
    index: true
  },
  reviews: {
    type: [Schema.Types.ObjectId],
    ref: 'Review',
    default: [],
    index: true
  },
  title: {
    type: String,
    default: ''
  }
});

// Define a view to be used for collection responses.
CollectionSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'context': this.context,
      'owner': this.owner,
      'products': this.products,
      'reviews': this.reviews,
      'title': this.title
    };
  });

// Declare the collection mongoose model.
const Collection: Mongoose.Model<CollectionDetailsDocument> = Mongoose.model('Collection', CollectionSchema);

// Declare the collection mongoose model.
export default Collection;

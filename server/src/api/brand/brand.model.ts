/**
 * brand.model.js
 * Brand class to manage the brand models.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  BrandDetailsDocument
} from './brand.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the brand schema to be the base for the brand model.
const BrandSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  name: {
    type: String,
  },
  namePartials: {
    type: Array,
    default: [],
    index: true
  },
  admins:  { 
    type: [Schema.Types.ObjectId],
    ref: 'User',
  },
  url: {
    type: String,
    index: true,
  }
});

// Define a view to be used for brand responses.
BrandSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'description': this.description,
      'name': this.name,
      'url': this.url
    };
  });

/**
 * Pre-Save hook to set a custom url before saving.
 */
BrandSchema
  .pre<BrandDetailsDocument>('save', function(next: Mongoose.HookNextFunction) {
    const brand: string = encodeURIComponent(this.name.split(' ').join('_')
            .split('&').join('and').toLowerCase());

    const id = this._id.toString();

    const unique: string = id.substring(id.length - 5, id.length - 1);

    this.url = `/brand/${brand}/${unique}`;

    next();
  });

// Declare the brand mongoose model.
const Brand: Mongoose.Model<BrandDetailsDocument> = Mongoose.model('Brand', BrandSchema);

// Declare the User mongoose model.
export default Brand;

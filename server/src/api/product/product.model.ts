/**
 * product.model.js
 * Product class to manage the product models.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import {
  Category,
  ProductDetailsDocument
} from './product.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the product schema to be the base for the product model.
const ProductSchema = new Schema({
  brand: {
    type: String,
  },
  brandPartials: {
    type: Array,
    default: [],
    index: true
  },
  categories: {
    type: Array,
    default: []
  },
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
  },
  namePartials: {
    type: Array,
    default: [],
    index: true
  },
  creator:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
  },
  url: {
    type: String,
    index: true,
  }
});

// Define a view to be used for product responses.
ProductSchema
  .virtual('details')
  .get(function() {
    return {
      '_id': this._id,
      'brand': this.brand,
      'categories': this.categories,
      'name': this.name,
      'url': this.url
    };
  });

/**
 * Pre-Save hook to set a custom url before saving.
 */
ProductSchema
  .pre<ProductDetailsDocument>('save', function(next: Mongoose.HookNextFunction) {
    const name: string = this.name.split(' ').join('_')
            .split('&').join('and').toLowerCase(),
          brand: string = encodeURIComponent(this.brand.split(' ').join('_')
            .split('&').join('and').toLowerCase());

    let url = '',
        i = 0;

    do {
      const current: Category = this.categories[i];

      const label: string = current.label.split(' ').join('_')
        .split('&').join('and').toLowerCase();

      url += `${label}/`
      i++;
    } while (i < this.categories.length);

    this.url = `${url}${brand}/${name}`;

    next();
  });

// Declare the product mongoose model.
const Product: Mongoose.Model<ProductDetailsDocument> = Mongoose.model('Product', ProductSchema);

// Declare the User mongoose model.
export default Product;

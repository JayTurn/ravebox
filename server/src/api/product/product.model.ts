/**
 * product.model.js
 * Product class to manage the product models.
 */

// Modules.
import * as Mongoose from 'mongoose';
import BrandCommon from '../brand/brand.common';
import ProductCommon from './product.common';
import TagCommon from '../tag/tag.common';

// Interfaces.
import {
  BrandDetails
} from '../brand/brand.interface';
import {
  ProductDetails,
  ProductDocument,
  ProductImage
} from './product.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the product schema to be the base for the product model.
const ProductSchema = new Schema({
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    index: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  images: {
    type: [{
      title: String,
      url: String
    }],
    default: []
  },
  name: {
    type: String,
  },
  namePartials: {
    type: Array,
    default: [],
    index: true
  },
  nameRaw: {
    type: String,
  },
  productType: {
    type: Schema.Types.ObjectId, 
    ref: 'Tag',
    index: true,
  },
  creator:  { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
  },
  url: {
    type: String,
    index: true,
  },
  website: {
    type: String,
    default: ''
  }
});

// Define a view to be used for product responses.
ProductSchema
  .virtual('details')
  .get(function() {

    // Load the brand document.
    const brand: BrandDetails = this.brand ? BrandCommon.RetrieveDetailsFromDocuments(this.brand) : {
      _id: '',
      description: '',
      logo: '',
      name: 'N/A',
      url: ''
    };

    // Define the base product details and extend with the
    // optional properties if they exist.
    const product: ProductDetails = {
      _id: this._id as Mongoose.Types.ObjectId,
      brand: brand,
      name: this.name,
      url: this.url,
    };

    if (this.competitors) {
      product.competitors = this.competitors as Array<Mongoose.Types.ObjectId>;
    }

    if (this.description) {
      product.description = this.description as string;
    }

    if (this.images) {
      product.images = this.images as Array<ProductImage>;
    }

    if (this.productType && this.productType.name) {
      product.productType = TagCommon.RetrieveDetailsFromDocuments(
        this.productType);
    }

    if (this.website) {
      product.website = this.website as string;
    }

    return product;
  });

/**
 * Pre-Save hook to set a custom url before saving.
 */
ProductSchema
  .pre<ProductDocument>('save', async function(next: Mongoose.HookNextFunction) {

    await ProductCommon.UpdateDocumentURL(this);

    next();
  });

// Declare the product mongoose model.
const Product: Mongoose.Model<ProductDocument> = Mongoose.model('Product', ProductSchema);

// Declare the User mongoose model.
export default Product;

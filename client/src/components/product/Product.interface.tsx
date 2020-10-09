/**
 * Product.interface.tsx
 * Interfaces for the products.
 */

// Interfaces.
import { Brand } from '../brand/Brand.interface';
import { CategoryItem } from '../category/Category.interface';
import { ImageAndTitle } from '../elements/image/Image.interface';
import { Review } from '../review/Review.interface';
import { Tag } from '../tag/Tag.interface';

export interface Product {
  _id: string;
  brand: Brand;
  category?: Tag;
  competitors?: Array<Product>;
  complementary?: Array<Product>;
  description?: string;
  images?: Array<ImageAndTitle>;
  name: string;
  productType: Tag;
  tags?: Array<Tag>;
  url: string;
  website?: string;
}

export interface ProductGroup {
  category: CategoryItem;
  subCategory: CategoryItem;
  products: Array<Product>;
}

/**
 * Paramters used when retrieving a product from the api.
 */
export interface RetrieveProductByIdParams {
  id: string;
}

/**
 * Paramters used when retrieving a product from the api.
 */
export interface RetrieveProductByURLParams {
  existing?: ProductView;
  setProductView?: (productView: ProductView) => void;
  requested: ProductByURLMatchParams;
}

/**
 * Product response interface.
 */
export interface ProductResponse {
  product: Product;
  reviews?: Array<Review>;
}

/**
 * Product view interface.
 */
export interface ProductView {
  product: Product;
  reviews?: Array<Review>;
}

export interface ProductByIdMatchParams {
  id: string;
}

export interface ProductByURLMatchParams {
  category: string;
  subCategory: string;
  brand: string;
  productName: string;
}

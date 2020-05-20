/**
 * Product.interface.tsx
 * Interfaces for the products.
 */

// Interfaces.
import { CategoryItem } from '../category/Category.interface';
import { Review } from '../review/Review.interface';

export interface Product {
  _id: string;
  brand: string;
  categories: Array<CategoryItem>;
  name: string;
  url: string;
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

/**
 * Product.interface.tsx
 * Interfaces for the products.
 */

// Interfaces.
import { CategoryItem } from '../category/Category.interface';

export interface Product {
  _id: string;
  brand: string;
  categories: Array<CategoryItem>;
  name: string;
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
  brand: string;
  productName: string;
  reviewTitle: string;
}

/**
 * Product response interface.
 */
export interface ProductResponse {
  product: Product;
}

export interface ProductByIdMatchParams {
  id: string;
}

export interface ProductByURLMatchParams {
  id: string;
}

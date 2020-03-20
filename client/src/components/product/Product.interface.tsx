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

/**
 * Paramters used when retrieving a product from the api.
 */
export interface RetrieveProductParams {
  id: string;
}

/**
 * Product response interface.
 */
export interface ProductResponse {
  product: Product;
}

export interface ProductMatchParams {
  id: string;
}

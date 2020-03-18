/**
 * Product.interface.tsx
 * Interfaces for the products.
 */

export interface Product {
  _id?: string;
  brand: string;
  categories: Array<string>;
  name: string;
}

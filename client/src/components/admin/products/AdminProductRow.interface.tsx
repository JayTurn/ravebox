/**
 * AdminProductRow.interface.tsx
 * Interfaces for the admin product row.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../../product/Product.interface';

/**
 * Admin product row properties.
 */
export interface AdminProductRowProps {
  index: number;
  product: Product;
  update: (product: Product) => (index: number) => void;
  xsrf?: string;
}

/**
 * Interface for the product update response.
 */
export interface UpdateProductFormResponse extends APIResponse {
  product: Product;
}

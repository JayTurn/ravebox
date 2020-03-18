/**
 * ProductForm.interface.tsx
 * Interfaces for the product form.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../Product.interface';

export interface ProductFormProps {
  xsrf?: string;
}

export interface ProductFormResponse extends APIResponse {
  product: Product;
}

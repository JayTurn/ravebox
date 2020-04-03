/**
 * ProductForm.interface.tsx
 * Interfaces for the product form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../Product.interface';

export interface ProductFormProps extends RouteComponentProps {
  xsrf?: string;
}

export interface ProductFormResponse extends APIResponse {
  product: Product;
}

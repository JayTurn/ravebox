/**
 * AddProductForm.interface.tsx
 * Interfaces for the product form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../Product.interface';

export interface AddProductFormProps extends RouteComponentProps {
  xsrf?: string;
}

export interface AddProductFormResponse extends APIResponse {
  product: Product;
}

export interface AddProductStep {
  completed: boolean;
  help: string;
  id: string;
  title: string;
}

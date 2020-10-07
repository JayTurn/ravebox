/**
 * ProductSelection.interface.tsx
 * Interface for the product selection component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Brand } from '../../brand/Brand.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../Product.interface';

/**
 * Product selection properties.
 */
export interface ProductSelectionProps {
  brand: Brand;
  complete: (product: Product) => void;
  update: (product: Product) => void;
  xsrf?: string;
} 

export interface ProductSelectionForm {
  name: string;
  brand: string;
}

/**
 * Interface for the product search response.
 */
export interface ProductSearchResponse extends APIResponse {
  products: Array<Product>;
}

/**
 * Interface for the product creation response.
 */
export interface AddProductFormResponse extends APIResponse {
  product: Product;
}

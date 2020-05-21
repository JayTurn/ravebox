/**
 * ProductSelection.interface.tsx
 * Interface for the product selection component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../Product.interface';

/**
 * Product selection properties.
 */
export interface ProductSelectionProps {
  brand: string;
  update: (data: InputData) => void;
} 

export interface ProductSelectionForm {
  name: string;
}

/**
 * Interface for the product search response.
 */
export interface ProductSearchResponse extends APIResponse {
  products: Array<Product>;
}

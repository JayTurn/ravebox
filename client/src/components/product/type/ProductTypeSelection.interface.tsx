/**
 * ProductTypeSelection.interface.tsx
 * Interface for the product type selection component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../Product.interface';
import { Tag } from '../../tag/Tag.interface';

/**
 * Product type selection properties.
 */
export interface ProductTypeSelectionProps {
  product: Product;
  complete: (product: Product) => void;
  xsrf?: string;
} 

export interface ProductTypeSelectionForm {
  name: string;
}

/**
 * Interface for the product search response.
 */
export interface ProductTypeSearchResponse extends APIResponse {
  tags: Array<Tag>;
}

/**
 * Interface for the product creation response.
 */
export interface AddProductTypeFormResponse extends APIResponse {
  product: Product;
}

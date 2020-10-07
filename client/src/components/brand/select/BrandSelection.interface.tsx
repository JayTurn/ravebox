/**
 * BrandSelection.interface.tsx
 * Interface for the brand selection component.
 */

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Brand } from '../Brand.interface';
import { InputData } from '../../forms/input/Input.interface';

/**
 * Brand selection properties.
 */
export interface BrandSelectionProps {
  completed: boolean;
  update: (brand: Brand) => void;
  xsrf?: string;
} 

export interface BrandSelectionForm {
  name: string;
}

/**
 * Interface for the brand search response.
 */
export interface BrandSearchResponse extends APIResponse {
  brands: Array<Brand>;
}

/**
 * Interface for the brand creation response.
 */
export interface AddBrandFormResponse extends APIResponse {
  brand: Brand;
}

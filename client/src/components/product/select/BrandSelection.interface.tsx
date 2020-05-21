/**
 * BrandSelection.interface.tsx
 * Interface for the brand selection component.
 */

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';

/**
 * Brand selection properties.
 */
export interface BrandSelectionProps {
  update: (data: InputData) => void;
} 

export interface BrandSelectionForm {
  brand: string;
}

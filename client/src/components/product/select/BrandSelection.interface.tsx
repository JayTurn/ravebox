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
  visible: boolean;
  update: (data: InputData) => void;
  handleFocus: (e: React.SyntheticEvent) => void;
} 

export interface BrandSelectionForm {
  brand: string;
}

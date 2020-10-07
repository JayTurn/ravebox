/**
 * BrandSelectList.interface.tsx
 * Interfaces for the brand selection component.
 */

// Interfaces.
import { Brand } from '../Brand.interface';

/**
 * Brand select list properts.
 */
export interface BrandSelectListProps {
  brands: Array<Brand>;
  select: (brand: Brand) => void;
}

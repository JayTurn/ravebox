/**
 * CategorySelection.interface.tsx
 * Interfaces for selecting product categories.
 */

// Interfaces.
import { CategoryItem } from '../Category.interface';

export interface CategorySelectionProps {
  update: (categoryType: string) => (selected: Array<CategoryItem>) => void;
  visible: boolean;
}

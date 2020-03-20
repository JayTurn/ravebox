/**
 * CategorySelection.interface.tsx
 * Interfaces for selecting product categories.
 */

// Interfaces.
import { CategoryItem } from '../Category.interface';

export interface CategorySelectionProps {
  update: (selected: Array<CategoryItem>) => void;
}

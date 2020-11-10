/**
 * CategoryStreamTabMenu.interface.tsx
 * Interfaces for the category stream tabs.
 */

// Interfaces.
import { RaveStreamCategoryList } from '../RaveStream.interface';

/**
 * CategoryStreamTabMenu properties.
 */
export interface CategoryStreamTabMenuProps {
  activeIndex?: number;
  categoryList?: Array<RaveStreamCategoryList>;
  updateActiveCategory?: (index: number) => void;
}

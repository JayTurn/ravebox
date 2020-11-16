/**
 * CategoryStreamTabs.interface.tsx
 * Interfaces for the category stream tabs.
 */

// Interfaces.
import { RaveStreamCategoryList } from '../RaveStream.interface';

/**
 * CategoryStreamTabs properties.
 */
export interface CategoryStreamTabsProps {
  activeIndex?: number;
  categoryList?: Array<RaveStreamCategoryList>;
  updateActiveCategory?: (index: number) => void;
}

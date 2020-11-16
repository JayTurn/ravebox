/**
 * CategoryStreamTab.interface.tsx
 * Interfaces for the category stream tabs.
 */

// Interfaces.
import { RaveStreamCategoryList } from '../RaveStream.interface';

/**
 * CategoryStreamTab properties.
 */
export interface CategoryStreamTabProps {
  activeIndex: number;
  index: number;
  categoryList: RaveStreamCategoryList;
  updateHeight: (value: number) => void;
}

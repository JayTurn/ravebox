/**
 * Category.interface.tsx
 * Interfaces for categories.
 */

export interface Category extends CategoryItem {
  children?: Category[]; 
}

export interface CategoryItem {
  key: string;
  label: string;
}

/**
 * Category.interface.tsx
 * Interfaces for categories.
 */

export interface Category {
  key: string;
  label: string;
  children?: Category[]; 
}

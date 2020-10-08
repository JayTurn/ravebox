/**
 * AdminAutoCompleteField.interface.tsx
 * Interfaces for the admin autocomplete fields.
 */

// Interfaces.

/**
 * Admin autocompelete field props.
 */
export interface AdminAutoCompleteFieldProps {
  addNew?: (name: string) => void;
  addEnabled?: boolean;
  close: () => void;
  defaultValue: string;
  options: Array<string>;
  search: (query: string) => Promise<void> | undefined;
  select: (index: number) => void;
  fieldTitle: string;
}

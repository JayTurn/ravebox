/**
 * ProductSelectList.interface.tsx
 * Interfaces for the product select list.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { Product } from '../Product.interface';

/**
 * Product select list properties.
 */
export interface ProductSelectListProps extends RouteComponentProps {
  products: Array<Product>;
  select: (product: Product) => void;
}

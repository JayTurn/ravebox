/**
 * ProductTypeSelectList.interface.tsx
 * Interfaces for the product type select list.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { Product } from '../Product.interface';
import { Tag } from '../../tag/Tag.interface';

/**
 * Product type select list properties.
 */
export interface ProductTypeSelectListProps extends RouteComponentProps {
  product: Product;
  select: (tag: Tag) => void;
  tags: Array<Tag>;
}

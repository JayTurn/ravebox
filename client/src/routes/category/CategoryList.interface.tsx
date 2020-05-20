/**
 * CategoryList.interface
 * Interfaces for the Category component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { Category } from '../../components/category/Category.interface';
import { ReviewGroup } from '../../components/review/Review.interface';

/**
 * Category properties.
 */
export interface CategoryListProps extends RouteComponentProps<CategoryListMatchParams> {
  categoryGroup?: ReviewGroup;
  updateListByCategory?: (reviews: ReviewGroup) => void;
}

/**
 * Category url match parameters.
 */
export interface CategoryListMatchParams {
  category: string;
}

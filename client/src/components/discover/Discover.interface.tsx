/**
 * Discover.interface.tsx
 * Interfaces for the discover components.
 */

// Interfaces.
import { APIResponse } from '../../utils/api/Api.interface';
import { Category } from '../category/Category.interface';
import { Product } from '../product/Product.interface';
import { Review } from '../review/Review.interface';

/**
 * Discover review groups.
 */
export interface DiscoverGroup {
  category: Category;
  items: Array<DiscoverSubGroup>;
}

/**
 * Discover review sub-groups.
 */
export interface DiscoverSubGroup {
  category: Category;
  items: Array<DiscoverProductGroup>;
}

/**
 * Discover review product groups.
 */
export interface DiscoverProductGroup {
  product: Product;
  reviews: Array<Review>;
}

/**
 * Parameters for the discover groups hook.
 */
export interface RetrieveDiscoverGroupsParams {
  term: string;
  existing: Array<DiscoverGroup>;
  updateGroups?: (discoverGroups: Array<DiscoverGroup>) => void;
}

/**
 * Discover match params.
 */
export interface DiscoverSearchMatchParams {
  term: string;
}

/**
 * Discover response interface.
 */
export interface DiscoverGroupsResponse extends APIResponse {
  groups: Array<DiscoverGroup>;
}

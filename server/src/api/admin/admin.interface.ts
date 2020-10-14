/**
 * admin.interface.ts
 * Interfaces for admin properties.
 */

// Enumerators.
import { SortDirection } from '../../shared/enumerators/sort.enum';
import { TagAssociation } from '../tag/tag.enum';

/**
 * Product search paramaters interface.
 */
export interface ProductSearchParams {
  //filters?: ProductSearchFilters;
  sort: ProductSearchSort;
}

/**
 * Product search filter parameters.
 */
//export interface ProductSearchFilters { }

/**
 * Product search sort parameters.
 */
export interface ProductSearchSort {
  created: SortDirection;
}

/**
 * Product search query.
 */
export interface ProductSearchQuery {
  namePartials?: RegExp;
  brand?: string;
  productType?: string;
}

/**
 * Tag search sort parameters.
 */
export interface TagSearchSort {
 name: SortDirection;
}

/**
 * Tag search query.
 */
export interface TagSearchQuery {
  namePartials?: RegExp;
  context?: string;
  association?: TagAssociation;
}

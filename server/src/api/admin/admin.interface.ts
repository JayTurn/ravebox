/**
 * admin.interface.ts
 * Interfaces for admin properties.
 */

// Enumerators.
import { SortDirection } from '../../shared/enumerators/sort.enum';

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
  name?: string;
  brand?: string;
  productType?: string;
}

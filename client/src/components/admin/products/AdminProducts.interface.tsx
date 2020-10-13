/**
 * AdminProducts.interface.tsx
 * Interfaces for the screen to manage products.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { SortDirection } from '../Sort.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Product } from '../../product/Product.interface';

/**
 * Admin products properties.
 */
export interface AdminProductsProps extends RouteComponentProps {
}

/**
 * Parameters for retrieving a list of products.
 */
export interface RetrieveProductsListParams {
  filters?: ProductSearchFilterParams;
  sort: ProductSearchSortParams;
}

export interface RetrieveProductsListResponse extends APIResponse {
  products: Array<Product>;
}

/**
 * Filters for product search.
 */
export interface ProductSearchFilterParams {
  brand: string;
  productType: string;
}

/**
 * Sort parameters for product search.
 */
export interface ProductSearchSortParams {
  created: SortDirection;
}

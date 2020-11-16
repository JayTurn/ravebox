/**
 * ViewProduct.interface.tsx
 * Interfaces for the view product screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  ProductView,
  ProductByURLMatchParams
} from '../../../components/product/Product.interface';

/**
 * ViewProduct properties.
 */
export interface ViewProductProps extends RouteComponentProps<ProductByURLMatchParams> {
  productView?: ProductView;
  updateActive?: (productView: ProductView) => void;
}

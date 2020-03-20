/**
 * AddReview.interface.tsx
 * Interfaces for the add review screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { ProductMatchParams } from '../../../components/product/Product.interface';

/**
 * AddReview properties.
 */
export interface AddReviewProps extends RouteComponentProps<ProductMatchParams> { }

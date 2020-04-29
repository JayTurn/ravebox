/**
 * ProductPreview.interface.tsx
 * Interfaces for the product preview.
 */

// Enumerators.
import { Recommended } from '../../review/recommendation/Recommendation.enum';

// Interfaces.
import { Product } from '../Product.interface';

export interface ProductPreviewProps extends Product {
  recommendation?: {
    handle: string;
    recommended: Recommended;
  }
}

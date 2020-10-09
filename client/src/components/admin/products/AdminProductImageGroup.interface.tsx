/**
 * AdminProductImageGroup.interface.tsx
 * Interfaces for the admin product image group display.
 */

// Interfaces.
import { ImageAndTitle } from '../../elements/image/Image.interface';

/**
 * Admin product image group properties.
 */
export interface AdminProductImageGroupProps {
  images: Array<ImageAndTitle>;
  update: (updatedImages: Array<ImageAndTitle>) => void;
}

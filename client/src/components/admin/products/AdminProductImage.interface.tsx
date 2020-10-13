/**
 * AdminProductImage.interface.tsx
 * Interfaces for the admin product image display.
 */

// Interfaces.
import { ImageAndTitle } from '../../elements/image/Image.interface';

/**
 * Admin product image properties.
 */
export interface AdminProductImageProps {
  image: ImageAndTitle;
  index: number;
  removeImage: (index: number) => void;
  shiftPosition: (current: number) => (value: number) => void;
  update: (image: ImageAndTitle) => (index: number) => void;
}

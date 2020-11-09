/**
 * DesktopProductImages.interface.tsx
 * Interfaces for the desktop product images.
 */

// Interfaces.
import { ImageAndTitle } from '../../elements/image/Image.interface';

/**
 * Properties for the desktop product images.
 */
export interface DesktopProductImagesProps {
  images: Array<ImageAndTitle>;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

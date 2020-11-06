/**
 * DesktopRaveActions.interface.tsx
 * Interfaces for the desktop rave actions.
 */

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';

/**
 * DesktopRaveActions properties.
 */
export interface DesktopRaveActionsProps {
  activeIndex?: number;
  product?: Product;
  raveStream?: RaveStream;
}

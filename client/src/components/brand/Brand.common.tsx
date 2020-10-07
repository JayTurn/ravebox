/**
 * Brand.common.tsx
 * Common functions for brands.
 */

// Interface.
import { Brand } from './Brand.interface';

/**
 * Creates an empty Brand object for use in object definitions.
 *
 * @return EventObject
 */
export const emptyBrand: (
) => Brand = (
): Brand => {
  return {
    _id: '',
    logo: '', 
    name: '',
    url: ''
  };
}

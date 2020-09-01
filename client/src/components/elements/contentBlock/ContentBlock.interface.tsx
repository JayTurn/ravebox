/**
 * ContentBlock.interface.tsx
 *
 * Interfaces for the content block.
 */

// Enumerators.
import { ColorStyle } from './ContentBlock.enum'; 

/**
 * ContentBlock component properties.
 */
export interface ContentBlockProps {
  background: ColorStyle;
  title?: React.ReactElement;
  bodyFirst?: React.ReactElement;
  bodySecond?: React.ReactElement;
  reducedBottomMargin?: boolean;
}

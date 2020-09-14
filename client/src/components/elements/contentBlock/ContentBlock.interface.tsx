/**
 * ContentBlock.interface.tsx
 *
 * Interfaces for the content block.
 */

// Enumerators.
import { ColorStyle } from './ContentBlock.enum'; 

// Interfaces.
import { LinkTrackingData } from '../link/Link.interface';

/**
 * ContentBlock component properties.
 */
export interface ContentBlockProps {
  background: ColorStyle;
  title?: React.ReactElement;
  bodyFirst?: React.ReactElement;
  bodySecond?: React.ReactElement;
  reducedBottomMargin?: boolean;
  reducedVerticalSpace?: boolean;
  action?: {
    path: string;
    title: string;
    track?: LinkTrackingData;
  };
}

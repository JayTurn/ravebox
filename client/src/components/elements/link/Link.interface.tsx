/**
 * LinkElement.interface.tsx
 * Styled link element for site-wide usage.
 */

// Modules.
import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';

// Enumerators.
import { StyleType } from './Link.enum';

export interface LinkProps extends MaterialLinkProps {
  title: string;
  path: string;
  size?: 'large' | 'small';
  styleType?: StyleType;
  track?: LinkTrackingData;
}

export interface LinkTrackingData {
  context: string;
  targetScreen: string;
}

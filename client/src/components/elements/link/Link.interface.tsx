/**
 * LinkElement.interface.tsx
 * Styled link element for site-wide usage.
 */

import { LinkProps as MaterialLinkProps } from '@material-ui/core/Link';

export interface LinkProps extends MaterialLinkProps {
  title: string;
  path: string;
}

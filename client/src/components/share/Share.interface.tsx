/**
 * ShareButton.interface.tsx
 * Interfaces for the share button.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

/**
 * Share component properties interface.
 */
export interface ShareProps extends RouteComponentProps {
  title: string;
  description?: string;
  image?: string;
}

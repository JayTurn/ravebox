/**
 * ShareButton.interface.tsx
 * Interfaces for the share button.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { WebShareInterface } from 'react-web-share-api';

/**
 * Share component properties interface.
 */
export interface ShareButtonProps {
  title: string;
  description?: string;
  image?: string;
  url: string;
}

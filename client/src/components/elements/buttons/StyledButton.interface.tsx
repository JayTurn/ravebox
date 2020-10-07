/**
 * StyledButton.interface.tsx
 * Interfaces for the styled button re-used across the application.
 */

// Interfaces.
import { ButtonProps } from '@material-ui/core/Button';

/**
 * Styled button properties.
 */
export interface StyledButtonProps extends ButtonProps {
  align?: 'left' | 'right' | '-moz-initial' | 'inherit' | 'initial' | 'revert' | 'unset' | 'none';
  title: string;
  clickAction: (e: React.MouseEvent<HTMLButtonElement>) => void;
  submitting?: boolean;
  orientation?: string;
}

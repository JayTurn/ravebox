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
  title: string;
  clickAction: () => void;
  submitting: boolean;
  orientation?: string;
}

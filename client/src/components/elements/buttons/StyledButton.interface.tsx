/**
 * StyledButton.interface.tsx
 * Interfaces for the styled button re-used across the application.
 */

/**
 * Styled button properties.
 */
export interface StyledButtonProps {
  title: string;
  clickAction: () => void;
  submitting: boolean;
}

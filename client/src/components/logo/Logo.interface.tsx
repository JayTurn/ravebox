/**
 * Logo.interface.tsx
 * Interfaces for the logo component.
 */

// Enumerators.
import { LogoColor } from './Logo.enum';

// Logo properties.
export interface LogoProps {
  color: LogoColor;
  iconOnly: boolean;
  fullWidth?: string;
  stacked?: boolean;
}

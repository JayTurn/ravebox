/**
 * Sponsored.interface.tsx
 * Interfaces for the sponsored component.
 */

/**
 * Sponsored component properties.
 */
export interface SponsoredProps {
  sponsored: boolean;
  update: (sponsored: boolean) => void;
}

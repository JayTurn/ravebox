/**
 * Image.interface.tsx
 * Interfaces for image objects.
 */

/**
 * Images with titles.
 */
export interface ImageAndTitle {
  title: string;
  url: string;
  creditText?: string;
  creditUrl?: string;
}

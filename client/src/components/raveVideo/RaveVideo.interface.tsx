/**
 * RaveVideo.interface.tsx
 * Interfaces for the video component.
 */

/**
 * Video review properties.
 */
export interface RaveVideoProps {
  reviewId: string;
  generateToken?: (reviewId: string) => (duration: number) => void;
  makeRatingAllowable?: (allowed: boolean) => void;
  url: string;
  xsrf?: string;
}

/**
 * Video progress interface.
 */
export interface VideoProgress {
  played: number,
  playedSeconds: number,
  loaded: number,
  loadedSeconds: number
}

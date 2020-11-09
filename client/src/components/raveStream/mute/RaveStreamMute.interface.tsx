/**
 * RaveStreamMute.interface.tsx
 *
 * Interfaces for the rave stream mute button.
 */

/**
 * Mute button properties.
 */
export interface RaveStreamMuteProps {
  muted?: boolean;
  mute?: (muted: boolean) => void;
}

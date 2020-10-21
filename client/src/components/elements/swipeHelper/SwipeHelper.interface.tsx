/**
 * SwipeHelper.interface.tsx
 * 
 * Interfaces for the swipe helper component.
 */

// Enumerators.
import { SwipeDirection } from './SwipeHelper.enum';

/**
 * Properties for the SwipeHelper component.
 */
export interface SwipeHelperProps {
  direction: SwipeDirection;
  title: string;
}

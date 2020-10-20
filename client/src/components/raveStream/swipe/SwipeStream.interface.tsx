/**
 * SwipeStream.interface.tsx
 * Interfaces for the swipeable rave stream component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  RaveStream,
  RaveStreamURLParams
} from '../RaveStream.interface';

/**
 * SwipeStream properties.
 */
export interface SwipeStreamProps extends RouteComponentProps<RaveStreamURLParams> {
  activeIndex?: number;
  ravePath?: string;
  raveStream?: RaveStream;
  updateActiveRaveStream?: (raveStream: RaveStream) => void;
  updateActiveIndex?: (index: number) => void;
}

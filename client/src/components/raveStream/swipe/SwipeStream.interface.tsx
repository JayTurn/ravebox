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
  raveStream?: RaveStream;
  updateActiveRaveStream?: (raveStream: RaveStream) => void;
}

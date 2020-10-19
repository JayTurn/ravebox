/**
 * RaveStream.interface.tsx
 * Interfaces for the rave stream route screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
//import {
  //RaveStream,
  //RaveStreamURLParams
//} from '../../components/raveStream/RaveStream.interface';
import {
  RaveStream,
  RaveStreamURLParams
} from '../../components/raveStream/RaveStream.interface';

/**
 * RaveStream properties.
 */
export interface RaveStreamProps extends RouteComponentProps<RaveStreamURLParams> {
  raveStream?: RaveStream;
  updateActiveRaveStream?: (raveStream: RaveStream) => void;
}

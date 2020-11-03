/**
 * RaveStream.tsx
 * RaveStream route component.
 */

// Modules.
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.
import SwipeStream from '../../components/raveStream/swipe/SwipeStream';

// Interfaces.
import {
  RaveStreamProps
} from './RaveStream.interface';

/**
 * Route to retrieve a rave stream and present the display components.
 */
const RaveStream: React.FC<RaveStreamProps> = (props: RaveStreamProps) => {
  return (
    <SwipeStream />
  );
}

export default withRouter(RaveStream);

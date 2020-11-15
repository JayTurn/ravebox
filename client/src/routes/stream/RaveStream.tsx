/**
 * RaveStream.tsx
 * RaveStream route component.
 */

// Modules.
import {
  useTheme,
} from '@material-ui/core/styles';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import DesktopStream from '../../components/desktopStream/DesktopStream';
import SwipeStream from '../../components/swipeStream/SwipeStream';

// Interfaces.
import {
  RaveStreamProps
} from './RaveStream.interface';

/**
 * Route to retrieve a rave stream and present the display components.
 */
const RaveStream: React.FC<RaveStreamProps> = (props: RaveStreamProps) => {
  // Define the component classes.
  const theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <React.Fragment>
      {largeScreen ? (
        <DesktopStream />
      ) : (
        <SwipeStream />
      )}
    </React.Fragment>
  );
}

export default withRouter(RaveStream);

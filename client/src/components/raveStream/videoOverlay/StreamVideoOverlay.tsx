/**
 * StreamVideoOverlay.tsx
 * Video for the stream component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TransitionGroup } from 'react-transition-group';
import * as React from 'react';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';
import StreamVideo from '../video/StreamVideo';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';
import {
  SwipeView,
  VideoPosition
} from '../swipe/SwipeStream.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  StreamVideoOverlayProps
} from './StreamVideoOverlay.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: `rgba(0,0,0,0.25)`,
      height: 'calc(100vh)',
      position: 'absolute',
      width: 'calc(100vw)',
      zIndex: 5
    },
    contentContainer: {
      height: '100%'
    }
  })
);

/**
 * Renders the controller which holds the videos in the stream.
 */
const StreamVideoOverlay: React.FC<StreamVideoOverlayProps> = (props: StreamVideoOverlayProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Triggers the move to the next video.
   */
  const handleNext: (
  ) => void = (
  ): void => {
    props.next();
  }

  /**
   * Triggers the move to the next video.
   */
  const handlePrevious: (
  ) => void = (
  ): void => {
    props.previous();
  }

  return (
    <Box className={clsx(classes.container)}>
      <Grid
        className={clsx(classes.contentContainer)}
        container
        alignItems='stretch'
      >
      </Grid>
    </Box>
  );
}

export default StreamVideoOverlay;

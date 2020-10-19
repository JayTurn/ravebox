/**
 * StreamReviewDetails.tsx
 * ReviewDetails for the stream component.
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
import * as React from 'react';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  StreamReviewDetailsProps
} from './StreamReviewDetails.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: 'blue',
      height: 'calc(100vh)',
      overflowY: 'auto'
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600
    }
  })
);

/**
 * Renders the video in the stream.
 */
const StreamReviewDetails: React.FC<StreamReviewDetailsProps> = (props: StreamReviewDetailsProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        <Typography variant='h2'>
          Review
        </Typography>
      </Grid>
    </Grid>
  );
}

export default StreamReviewDetails;

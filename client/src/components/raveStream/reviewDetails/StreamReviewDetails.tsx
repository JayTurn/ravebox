/**
 * StreamReviewDetails.tsx
 * ReviewDetails for the stream component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
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

// Components.
import FollowButton from '../../follow/button/FollowButton';
import StreamUserProfile from '../userProfile/StreamUserProfile';

// Enumerators.
import {
  FollowType
} from '../../follow/FollowType.enum';
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
      backgroundColor: theme.palette.background.default,
      height: 'calc(100vh)',
      overflowY: 'auto',
    },
    followContainer: {
      marginTop: theme.spacing(2)
    },
    userContainer: {
      backgroundColor: `rgba(0,0,0,0.04)`,
      padding: theme.spacing(10, 1, 2)
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

  const { user } = {...props.review};

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        {user &&
          <Grid container>
            <Grid item xs={12}>
              <Grid
                alignItems='center'
                className={classes.userContainer}
                container 
                justify='space-between'
              >
                <Grid item xs={12}>
                    <StreamUserProfile user={user} />
                </Grid>
                <Grid className={clsx(classes.followContainer)} item xs={12}>
                  <FollowButton
                    id={user._id}
                    handle={user.handle}
                    followType={FollowType.CHANNEL}
                  />
                </Grid> 
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid>
    </Grid>
  );
}

export default StreamReviewDetails;

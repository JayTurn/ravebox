/**
 * ReviewCardProfile.tsx
 * Displays the user's public profile in a review card.
 */

// Module.
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { ProfileStatistics } from '../../user/User.interface';
import { ReviewCardProfileProps } from './ReviewCardProfile.interface';

// Utilities.
import { formatReviewForTracking } from '../Review.common';
import { CountIdentifier } from '../../../utils/display/numeric/Numeric';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarIcon: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.grey.A700,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(4.5),
      width: theme.spacing(4.5)
    },
    handleText: {
      display: 'block',
      fontSize: '.8rem',
      fontWeight: 700,
    },
    linkText: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },
    title: {
      fontSize: '.95rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    titleContainer: {
      padding: theme.spacing(1, 0, 0)
    },
    userStatisticsText: {
      fontSize: '.7rem',
      fontWeight: 600,
      textTransform: 'uppercase'
    }
  })
);

/**
 * Formats the display of the user statistics.
 *
 * @param { ProfileStatistics } statistics - the user statistics.
 *
 * @return string
 */
const formatStatistics: (
  statistics: ProfileStatistics | undefined
) => string = (
  statistics: ProfileStatistics | undefined
): string => {
  let result: string = '';

  if (!statistics) {
    return result;
  }

  const ravesCount: string = CountIdentifier(statistics.reviews && statistics.reviews.length > 0 ? statistics.reviews.length : 1)('rave');

  result += ravesCount;

  if (statistics.followers > 0) {
    const followerCount: string = CountIdentifier(statistics.followers)('follower');

    result += ` | ${followerCount}`;
  }

  return result;
} 


/**
 * Review card profile for public display.
 */
const ReviewCardProfile: React.FC<ReviewCardProfileProps> = (props: ReviewCardProfileProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the style classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  /**
   * Tracks the review card navigation event.
   */
  const handleNavigation: (
  ) => void = (
  ): void => {

    // Format the review for tracking.
    const data: EventObject = formatReviewForTracking(props.context)(props.review);

    // Track the select event.
    analytics.trackEvent('select review')(data);
  }

  // Retrieve the user's first letter of their name.
  const firstLetter: string = props.user ? props.user.handle.substr(0,1) : 'r';

  // Format the user's statistics.
  const statisticsText: string = formatStatistics(props.user.statistics);

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12}>
        <Grid
          alignItems='center'
          container
          direction='row'
          style={{flexWrap: 'nowrap', maxWidth: '100%'}}
        >
          <Grid item>
            <NavLink
              className={classes.linkText}
              onClick={handleNavigation}
              to={`/review/${props.url}`}
            >
              <Avatar alt={props.user.handle} className={classes.avatarIcon}>{firstLetter}</Avatar>
            </NavLink>
          </Grid>
          <Grid item style={{flexGrow: 1, minWidth: 0, marginLeft: theme.spacing(1)}}>
            <NavLink
              className={classes.linkText}
              onClick={handleNavigation}
              to={`/review/${props.url}`}
            >
              <Typography variant='body2' className={classes.handleText}>
                {props.user.handle}
              </Typography>
              {props.user.statistics &&
                <Typography variant='body2' className={classes.userStatisticsText}>
                  {statisticsText}
                </Typography>
              }
            </NavLink>
          </Grid>
          <Grid item style={{flexGrow: 0}}>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReviewCardProfile;

/**
 * StreamUserProfile.tsx
 * Displays the user's public profile in a stream.
 */

// Module.
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
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Enumerators.
import { Role } from '../../user/User.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { ProfileStatistics } from '../../user/User.interface';
import { StreamUserProfileProps } from './StreamUserProfile.interface';

// Utilities.
import { CountIdentifier } from '../../../utils/display/numeric/Numeric';
import { getExternalAvatar } from '../../user/User.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(11.5),
      width: theme.spacing(11.5)
    },
    avatarIcon: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.grey.A700,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(11.5),
      width: theme.spacing(11.5)
    },
    handleText: {
      display: 'block',
      fontSize: '1.4rem',
      fontWeight: 700,
    },
    linkText: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },
    title: {
      fontSize: '1rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    titleContainer: {
      padding: theme.spacing(1, 0, 0)
    },
    userStatisticsText: {
      fontSize: '.8rem',
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

  const ravesCount: string = CountIdentifier(statistics.ravesCount)('rave');

  result += ravesCount;

  if (statistics.followers > 0) {
    const followerCount: string = CountIdentifier(statistics.followers)('follower');

    if (statistics.ravesCount > 0) {
      result += ` | `;
    }

    result += `${followerCount}`;
  }

  return result;
}


/**
 * Render the user profile in a stream.
 */
const StreamUserProfile: React.FC<StreamUserProfileProps> = (props: StreamUserProfileProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the style classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Retrieve the user's first letter of their name.
  const firstLetter: string = props.user ? props.user.handle.substr(0,1) : 'r';

  const avatar: string | undefined = props.user ? getExternalAvatar(props.user) : undefined;


  // Format the user's statistics.
  const statisticsText: string = formatStatistics(props.user.statistics);


  /**
   * Tracks the review card navigation event.
   */
  const handleNavigation: (
  ) => void = (
  ): void => {

    // Format the review for tracking.
    //const data: EventObject = formatReviewForTracking(props.context)(props.review);

    // Track the select event.
    //analytics.trackEvent('select review')(data);
  }

  return (
    <Grid
      container
      direction='row'
    >
      <Grid item xs={12}>
        <Grid
          alignItems='center'
          container
          style={{flexWrap: 'nowrap', maxWidth: '100%'}}
        >
          <Grid item>
            {avatar ? (
              <Avatar
                alt={props.user.handle}
                className={classes.avatar}
                src={avatar}
              />
            ) : (
              <Avatar
                alt={props.user.handle}
                className={classes.avatarIcon}
              >
                {props.user.role === Role.YOUTUBE ? 'y' : firstLetter}
              </Avatar>
            )}
          </Grid>
          <Grid item style={{flexGrow: 1, minWidth: 0, marginLeft: theme.spacing(2)}}>
            <Typography variant='body2' className={classes.handleText}>
              {props.user.role === Role.YOUTUBE ? 'youtube' : props.user.handle}
            </Typography>
            {props.user.statistics &&
              <Typography variant='body2' className={classes.userStatisticsText}>
                {statisticsText}
              </Typography>
            }
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StreamUserProfile;

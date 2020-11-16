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

// Components.
import FollowButton from '../../follow/button/FollowButton';

// Enumerators.
import {
  FollowType
} from '../../follow/FollowType.enum';
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
    },
    avatarIcon: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.grey.A700,
      fontSize: '.9rem',
      fontWeight: 600,
    },
    avatarSideSize: {
      height: theme.spacing(4),
      width: theme.spacing(4)
    },
    avatarSmallSize: {
      height: theme.spacing(6),
      width: theme.spacing(6)
    },
    avatarLargeSize: {
      height: theme.spacing(11.5),
      width: theme.spacing(11.5)
    },
    followContainer: {
      marginTop: theme.spacing(2)
    },
    handleLarge: {
      fontSize: '1.4rem',
      fontWeight: 700
    },
    handleSide: {
      fontSize: '.9rem',
      fontWeight: 700,
      lineHeight: 1
    },
    handleSmall: {
      fontSize: '1.15rem',
      fontWeight: 700
    },
    handleText: {
      display: 'block',
    },
    linkText: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },
    statisticsLarge: {
      fontSize: '.8rem',
      fontWeight: 600,
    },
    statisticsSide: {
      fontSize: '.75rem',
      fontWeight: 600,
    },
    statisticsSmall: {
      fontSize: '.8rem',
      fontWeight: 600,
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
    userContainer: {
      flexGrow: 1,
      minWidth: 0,
    },
    userContainerLarge: {
      marginLeft: theme.spacing(2)
    },
    userContainerSide: {
      marginLeft: theme.spacing(1)
    },
    userContainerSmall: {
      marginLeft: theme.spacing(2)
    },
    userStatisticsText: {
      textTransform: 'uppercase'
    },
    userYTText: {
      //textTransform: 'uppercase'
    },
    ytLarge: {
      fontSize: '.85rem',
      fontWeight: 600,
    },
    ytSide: {
      fontSize: '.75rem',
      fontWeight: 600,
    },
    ytSmall: {
      fontSize: '.8rem',
      fontWeight: 600,
    },
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
                className={clsx(
                  classes.avatar, {
                    [classes.avatarLargeSize]: props.variant === 'large',
                    [classes.avatarSideSize]: props.variant === 'side',
                    [classes.avatarSmallSize]: props.variant === 'small'
                  }
                )}
                src={avatar}
              />
            ) : (
              <Avatar
                alt={props.user.handle}
                className={clsx(
                  classes.avatarIcon, {
                    [classes.avatarLargeSize]: props.variant === 'large',
                    [classes.avatarSideSize]: props.variant === 'side',
                    [classes.avatarSmallSize]: props.variant === 'small'
                  }
                )}
              >
                {firstLetter}
              </Avatar>
            )}
          </Grid>
          <Grid item 
            className={clsx(
              classes.userContainer, {
                [classes.userContainerLarge]: props.variant === 'large',
                [classes.userContainerSide]: props.variant === 'side',
                [classes.userContainerSmall]: props.variant === 'small'
              }
            )}
          >
            <Typography variant='body2' className={clsx(
              classes.handleText, {
                [classes.handleLarge]: props.variant === 'large',
                [classes.handleSide]: props.variant === 'side',
                [classes.handleSmall]: props.variant === 'small'
              }
            )}>
              {props.user.handle}
            </Typography>
            {props.user.role === Role.YOUTUBE ? (
              <Typography variant='body2' className={clsx(
                classes.userYTText, {
                  [classes.ytLarge]: props.variant === 'large',
                  [classes.ytSide]: props.variant === 'side',
                  [classes.ytSmall]: props.variant === 'small'
                }
              )}>
                (via YouTube)
              </Typography>
            ) : (
              <React.Fragment>
                {props.user.statistics &&
                  <Typography variant='body2' className={clsx(
                    classes.userStatisticsText, {
                      [classes.statisticsLarge]: props.variant === 'large',
                      [classes.statisticsSide]: props.variant === 'side',
                      [classes.statisticsSmall]: props.variant === 'small'
                    }
                  )}>
                    {statisticsText}
                  </Typography>
                }
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Grid>
      {props.showFollow &&
        <Grid item xs={12} className={clsx(classes.followContainer)}>
          <FollowButton
            id={props.user._id}
            handle={props.user.handle}
            followType={FollowType.CHANNEL}
          />
        </Grid>
      }
    </Grid>
  );
};

export default StreamUserProfile;

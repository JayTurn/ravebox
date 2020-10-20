/**
 * StreamVideoOverlay.tsx
 * Video for the stream component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import StreamRate from '../rate/StreamRate';
import Share from '../../share/ShareButton';

// Enumerators
import {
  ShareStyle,
  ShareType
} from '../../share/ShareButton.enum';

// Interfaces.
import { EventObject } from '../../analytics/Analytics.interface';
import { PublicProfile } from '../../user/User.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';
import { StreamUserProps } from './StreamUser.interface';

// Utilities.
import { CountIdentifier } from '../../../utils/display/numeric/Numeric';
import {
  emptyReview,
  formatReviewProperties
} from '../../review/Review.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      border: `2px solid ${theme.palette.secondary.main}`,
      height: theme.spacing(5),
      width: theme.spacing(5)
    },
    avatarIcon: {
      border: `2px solid ${theme.palette.secondary.main}`,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(5),
      width: theme.spacing(5)
    },
    bottomContainer: {
      marginBottom: theme.spacing(1),
      padding: theme.spacing(0, 1)
    },
    container: {
      height: '100%',
      padding: theme.spacing(1)
    },
    handleText: {
      color: theme.palette.common.white,
      fontWeight: 600,
    },
    playButton: {
      borderRadius: 0,
      color: theme.palette.common.white,
      padding: 0
    },
    playIcon: {
      fontSize: '3rem'
    },
    statisticsText: {
      color: theme.palette.common.white,
      fontSize: '.7rem',
      textTransform: 'uppercase'
    },
    topContainer: {
      borderBottom: `1px solid ${theme.palette.common.white}`,
      padding: theme.spacing(0, 1, 1),
      marginBottom: theme.spacing(2)
    },
    userDetailsContainer: {
      marginLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  })
);

/**
 * Creates a statistics string.
 *
 * @param { PublicProfile } user - the user to generate statistics for.
 *
 * @return string
 */
const formatStatistics: (
  user?: PublicProfile
) => string = (
  user?: PublicProfile
): string => {
  let statistics: string = '';

  if (user && user.statistics) {
    const ravesCount: string = CountIdentifier(user.statistics.ravesCount)('rave');

    statistics += ravesCount;

    if (user.statistics.followers > 0) {
      const followerCount: string = CountIdentifier(user.statistics.followers)('follower');

      if (user.statistics.ravesCount > 0) {
        statistics += ` | `;
      }

      statistics += `${followerCount}`;
    }

  }

  return statistics;
}

/**
 * Renders the rave creator details in the stream.
 */
const StreamUser: React.FC<StreamUserProps> = (props: StreamUserProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const firstLetter: string = props.review && props.review.user ?
    props.review.user.handle.substr(0,1) : 'R';

  const statistics: string = props.review ? formatStatistics(props.review.user) : '';

  // Formats the review event data for tracking purposes.
  const [eventData, setEventData] = React.useState<EventObject>(
          formatReviewProperties({...props.review || emptyReview()}));

  const [reviewId, setReviewId] = React.useState<string>(props.review ? props.review._id : '');

  /**
   * Update the event data if the review id's don't match.
   */
  React.useEffect(() => {
    if (props.review && props.review._id !== reviewId) {
      setEventData(
        formatReviewProperties({...props.review})
      );
      setReviewId(props.review._id);
    }
  }, [props.review, reviewId]);

  return (
    <Grid
      alignItems='flex-end'
      className={clsx(classes.container)}
      container
    >
      {props.user &&
        <Grid
          className={clsx(classes.topContainer)}
          item
          xs={12}
        >
          <Grid container justify='space-between' alignItems='flex-end'>
            <Grid item>
              <Grid container alignItems='center'>
                <Grid item>
                  {props.user.avatar ? (
                    <Avatar
                      alt={props.user.handle}
                      className={clsx(classes.avatar)}
                      src={props.user.avatar}
                    />
                  ) : (
                    <Avatar
                      alt={props.user.handle}
                      className={clsx(classes.avatarIcon)}
                    >
                      {firstLetter} 
                    </Avatar>
                  )}    
                </Grid>
                <Grid item className={clsx(classes.userDetailsContainer)}>
                  <Typography
                    className={clsx(classes.handleText)}
                    variant='body1'
                  >
                    {props.user.handle}
                  </Typography>
                  {statistics &&
                    <Typography
                      className={clsx(classes.statisticsText)}
                      variant='body1'
                    >
                      {statistics}
                    </Typography>
                  }
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IconButton
                className={clsx(classes.playButton)}
                title='Play video'
                onClick={props.play}
              >
                {props.playing ? (
                  <PauseRoundedIcon className={clsx(classes.playIcon)}/>
                ) : (
                  <PlayArrowRoundedIcon className={clsx(classes.playIcon)}/>
                )}
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      }
      <Grid className={clsx(classes.bottomContainer)} item xs={12}>
        <Grid container justify='flex-start' alignItems='center'>
          {props.review && props.review.product && props.user &&
            <React.Fragment>
              <Grid item>
                <StreamRate review={props.review} />
              </Grid>
              <Grid item>
                <Share
                  color='#FFF'
                  eventData={eventData}
                  image={`${props.review.thumbnail}`}
                  shareStyle={ShareStyle.ICON}
                  shareType={ShareType.REVIEW}
                  title={`${props.review.product.brand.name} ${props.review.product.name} rave posted by ${props.user.handle}`}
                />
              </Grid>
            </React.Fragment>
          }
        </Grid>
      </Grid>
    </Grid>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: StreamUserProps) => {
  // Retrieve the current stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined,
      user: PublicProfile | undefined;

  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  if (review) {
    user = review.user;
  }

  return {
    ...ownProps,
    activeIndex,
    raveStream,
    review,
    user
  };
};

export default connect(
  mapStateToProps,
)(StreamUser);

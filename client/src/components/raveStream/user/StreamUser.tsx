/**
 * StreamVideoOverlay.tsx
 * Video for the stream component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import VolumeMuteRoundedIcon from '@material-ui/icons/VolumeMuteRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  mute
} from '../../../store/video/Actions';

// Components.
import Share from '../../share/ShareButton';
import RateRave from '../../rateRave/RateRave';

// Enumerators
import { Role } from '../../user/User.enum';
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
import {
  emptyReview,
  formatReviewProperties
} from '../../review/Review.common';
import { getExternalAvatar } from '../../user/User.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      border: `1px solid ${theme.palette.common.white}`,
      height: theme.spacing(6),
      width: theme.spacing(6)
    },
    avatarContainerLarge: {
      marginRight: theme.spacing(1)
    },
    avatarIcon: {
      border: `2px solid ${theme.palette.secondary.main}`,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(6),
      width: theme.spacing(6)
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
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    playButton: {
      borderRadius: 0,
      color: theme.palette.secondary.main,
      padding: 0
    },
    playIcon: {
      borderRadius: '1.5rem',
      border: `2px solid ${theme.palette.secondary.main}`,
      fontSize: '2.75rem'
    },
    muteButton: {
      color: theme.palette.common.white,
      padding: 0
    },
    muteButtonContainer: {
    },
    muteIcon: {
      fontSize: '2rem'
    },
    ratingContainer: {
      marginRight: theme.spacing(2)
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
      paddingBottom: theme.spacing(1)
    },
    ytText: {
      color: theme.palette.common.white,
      display: 'block',
      fontSize: '.65em',
      textAlign: 'center'
    },
    ytTextLarge: {
      textAlign: 'left'
    }
  })
);

/**
 * Renders the rave creator details in the stream.
 */
const StreamUser: React.FC<StreamUserProps> = (props: StreamUserProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const firstLetter: string = props.review && props.review.user ?
    props.review.user.handle.substr(0,1) : 'R';

  const avatar: string | undefined = props.user ? getExternalAvatar(props.user) : undefined; 

  // const statistics: string = props.review ? formatStatistics(props.review.user) : '';

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

  /**
   * Handles the mute state of the videos.
   */
  const handleMute: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    e.stopPropagation();

    if (props.mute) {
      props.mute(!props.muted);
    }

    return;
  }

  /**
   * Handles mouse down and mouse up events to stop proagation.
   */
  const handleMouse: (
    e: React.MouseEvent
  ) => void = (
    e: React.MouseEvent
  ): void => {
    e.stopPropagation();
  }

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
          <Grid container justify={largeScreen ? 'flex-start' : 'center'} alignItems={largeScreen ? 'center' : 'flex-end'}>
            <Grid item>
              <Grid container
                alignItems={largeScreen ? 'flex-start' : 'center'}
                direction={largeScreen ? 'row' : 'column'}
              >
                <Grid item xs={largeScreen ? undefined : 12}
                  className={clsx({
                    [classes.avatarContainerLarge]: largeScreen
                  })}
                >
                  {avatar ? (
                    <Avatar
                      alt={props.user.handle}
                      className={clsx(classes.avatar)}
                      src={avatar}
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
                <Grid item className={clsx(classes.userDetailsContainer)} xs={largeScreen ? undefined : 12}>
                  <Typography
                    className={clsx(classes.handleText)}
                    variant='body1'
                  >
                    {props.user.handle}
                    <React.Fragment>
                      {props.user.role === Role.YOUTUBE &&
                        <Box component='span' className={clsx(
                          classes.ytText, {
                            [classes.ytTextLarge] : largeScreen
                          }
                        )}>
                          (via YouTube)
                        </Box>
                      }
                    </React.Fragment>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      <Grid className={clsx(classes.bottomContainer)} item xs={12}>
        <Grid container justify='space-between' alignItems='baseline'>
          <Grid item>
            <Grid container justify='flex-start'>
              {props.review && props.review.product && props.user &&
                <React.Fragment>
                  <Grid item className={clsx(classes.ratingContainer)}>
                    <RateRave review={props.review} color='white' />
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
          <Grid item>
            <Grid container alignItems='center'>
              <Grid item className={clsx(classes.muteButtonContainer)}>
                <IconButton
                  className={clsx(classes.muteButton)}
                  title='Mute audio'
                  onClick={handleMute}
                  onMouseDown={handleMouse}
                  onMouseUp={handleMouse}
                >
                  {props.muted ? (
                    <VolumeOffRoundedIcon className={clsx(classes.muteIcon)}/>
                  ) : (
                    <VolumeMuteRoundedIcon className={clsx(classes.muteIcon)}/>
                  )}
                </IconButton>
              </Grid>
              {/*
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
              */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the stream.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      mute: mute,
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: StreamUserProps) => {
  // Retrieve the current stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0,
        muted: boolean = state.video ? state.video.muted : true;

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
    muted,
    raveStream,
    review,
    user
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StreamUser);

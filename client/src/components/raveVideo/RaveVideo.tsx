/**
 * RaveVideo.tsx
 * Renders the review video component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  withStyles,
  useTheme,
  Theme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Player from 'react-player';
import useResizeObserver from 'use-resize-observer/polyfilled';

// Enumerators.
import { VideoType } from '../review/Review.enum';

// Hooks.
import { useAnalytics } from '../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../analytics/Analytics.interface';
import {
  RaveVideoProps,
  VideoProgress
} from './RaveVideo.interface';

// Utilities.
import { formatReviewProperties } from '../review/Review.common';

/**
 * Styles for the wrapping button element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    height: 0,
    paddingTop: '56.25%',
    position: 'relative',
    overflow: 'hidden',
    width: '100%'
  },
  inside: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%'
  }
}));

/**
 * Renders the review video.
 */
const RaveVideo: React.FC<RaveVideoProps> = (props: RaveVideoProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const classes = useStyles();
  
  const playerRef = React.useRef<Player>(null);

  const [eventData, setEventData] = React.useState<EventObject>(
          formatReviewProperties({...props.review}));

  const [quarterWatched, setQuarterWatched] = React.useState<boolean>(false);
  const [halfWatched, setHalfWatched] = React.useState<boolean>(false);
  const [threeQuarterWatched, setThreeQuarterWatched] = React.useState<boolean>(false);
  const [completed, setCompleted] = React.useState<boolean>(false);

  const config = {
    controls: true,
    file: {
      forceHLS: true
    },
    height: '100%',
    url: props.review.videoURL || '',
    width: '100%'
  };

  /**
   * Create a ratings token when video is first played.
   */
  const handleStart: (
  ) => void = (
  ): void => {
    const current = playerRef.current;

    let duration: number = 0;

    if (current) {
      duration = Math.floor(current.getDuration() - 3);

      // Update the event data duration.
      const data: EventObject = {...eventData};
      data['video duration'] = current.getDuration();

      // Add video specific properties to the review.
      setEventData({...data});

      analytics.trackEvent('play review video')(data);
    }

    if (props.generateToken) {
      props.generateToken(props.review._id)(duration);
    }

  }

  /**
   * Handles the video completion event.
   */
  const handleComplete: (
  ) => void = (
  ): void => {
    // Define the player reference.
    const current: Player | null = playerRef.current;

    // If we have a player reference, track the video completion event.
    if (current) {
      const duration: number = Math.floor(current.getDuration());

      if (props.makeRatingAllowable) {
        props.makeRatingAllowable({
          allowed: true,
          played: 1,
          playedSeconds: duration,
          videoDuration: duration
        });
      }

      // Update the event data duration.
      const data: EventObject = formatReviewProperties({...props.review});

      data['video duration'] = duration;
      
      analytics.trackEvent('complete review video')(data);
    }
  }

  /**
   * Handles the progress of video.
   */
  const handleProgress: (
    state: VideoProgress 
  ) => void = (
    state: VideoProgress 
  ): void => {
    // Define the player reference.
    const current: Player | null = playerRef.current;

    // If we have a player reference, check if we have passed the minimum
    // watch duration so we can set the allowable rating state.
    if (current) {
      const duration: number = Math.floor(current.getDuration());
      const minimumDuration: number = Math.floor(current.getDuration() / 2);

      if (props.makeRatingAllowable) {
        if (state.playedSeconds > minimumDuration) {
          props.makeRatingAllowable({
            allowed: true,
            played: state.played,
            playedSeconds: Math.floor(state.playedSeconds),
            videoDuration: duration
          });
        } else {
          props.makeRatingAllowable({
            allowed: false,
            played: state.played,
            playedSeconds: Math.floor(state.playedSeconds),
            videoDuration: duration
          });
        }
      }

      // Update the progress of the playback tracking event.
      const data: EventObject = {...eventData};

      if (state.played > 0.25 && !quarterWatched) {
        data['watched seconds'] = Math.floor(state.playedSeconds);
        data['watched percentage'] = '0.25';
        setQuarterWatched(true);

        analytics.trackEvent('continue review video')(data);
      }

      if (state.played > 0.5 && !halfWatched) {
        data['watched seconds'] = Math.floor(state.playedSeconds);
        data['watched percentage'] = '0.5';
        setHalfWatched(true);
        analytics.trackEvent('continue review video')(data);
      }

      if (state.played > 0.75 && !threeQuarterWatched) {
        data['watched seconds'] = Math.floor(state.playedSeconds);
        data['watched percentage'] = '0.75';
        setThreeQuarterWatched(true);
        analytics.trackEvent('continue review video')(data);
      }

    }
  }

  return (
    <Grid container direction='column'>
      {props.review.videoURL &&
        <Box className={clsx(classes.container)}>
          <Box className={clsx(classes.inside)}>
            <Player
              {...config} 
              progressInterval={5000}
              onEnded={handleComplete}
              onProgress={handleProgress}
              onStart={handleStart}
              ref={playerRef}
            />
          </Box>
        </Box>
      }
    </Grid>
  );
}

export default RaveVideo;

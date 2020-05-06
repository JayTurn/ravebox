/**
 * RaveVideo.tsx
 * Renders the review video component.
 */

// Modules.
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Player from 'react-player';
import useResizeObserver from 'use-resize-observer/polyfilled';

// Interfaces.
import {
  RaveVideoProps,
  VideoProgress
} from './RaveVideo.interface';

/**
 * Renders the review video.
 */
const RaveVideo: React.FC<RaveVideoProps> = (props: RaveVideoProps) => {
  //const { ref, width = 1, height = 1 } = useResizeObserver();
  
  const playerRef = React.useRef<Player>(null)

  const config = {
    controls: true,
    file: {
      forceDASH: true
    },
    height: '100%',
    url: props.url,
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
    }

    if (props.generateToken) {
      props.generateToken(props.reviewId)(duration);
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
    console.log('Progress: ', state.playedSeconds);

    // If we have a player reference, check if we have passed the minimum
    // watch duration so we can set the allowable rating state.
    if (current) {
      const minimumDuration: number = Math.floor(current.getDuration() / 2);

      if (state.playedSeconds > minimumDuration) {
        console.log('Allowed');
        if (props.makeRatingAllowable) {
          props.makeRatingAllowable(true);
        }
      }
    }
  }

  return (
    <Grid container direction='column'>
      {props.url &&
        <Player
          {...config} 
          progressInterval={5000}
          onProgress={handleProgress}
          onStart={handleStart}
          ref={playerRef}
        />
      }
    </Grid>
  );
}

export default RaveVideo;

/**
 * RaveVideo.tsx
 * Renders the review video component.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Player from 'react-player';
import useResizeObserver from 'use-resize-observer/polyfilled';

// Interfaces.
import { RaveVideoProps } from './RaveVideo.interface';

/**
 * Renders the review video.
 */
const RaveVideo: React.FC<RaveVideoProps> = (props: RaveVideoProps) => {
  const { ref, width = 1, height = 1 } = useResizeObserver();

  const config = {
    controls: true,
    file: {
      forceDASH: true
    },
    height: '100%',
    url: props.url,
    width: '100%'
  };

  return (
    <Grid container direction='column'>
      <Player {...config} />
    </Grid>
  );
}

export default RaveVideo;

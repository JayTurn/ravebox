/**
 * RaveVideo.tsx
 * Renders the review video component.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Player from 'react-player';

// Interfaces.
import { RaveVideoProps } from './RaveVideo.interface';

/**
 * Renders the review video.
 */
const RaveVideo: React.FC<RaveVideoProps> = (props: RaveVideoProps) => {
  const config = {
    controls: true,
    file: {
      forceDASH: true
    },
    height: 'auto',
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

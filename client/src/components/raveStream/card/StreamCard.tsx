/**
 * StreamCard.tsx
 * StreamCard menu component.
 */

// Modules.
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { StreamCardProps } from './StreamCard.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  })
);

/**
 * Renders the rave stream card.
 */
const StreamCard: React.FC<StreamCardProps> = (props: StreamCardProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  return (
    <Grid container>
    </Grid>
  );
}

export default StreamCard;

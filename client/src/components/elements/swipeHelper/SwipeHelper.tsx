/**
 * SwipeHelper.tsx
 * SwipeHelper component.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Enumerators.
import { SwipeDirection } from './SwipeHelper.enum';

// Interfaces.
import { SwipeHelperProps } from './SwipeHelper.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrowDown: {
      transform: 'rotate(90deg)'
    },
    arrowUp: {
      transform: 'rotate(-90deg)'
    },
    icon: {
      //backgroundColor: `rgba(255,255,255,.1)`,
      borderRadius: 12,
      color: `rgba(255,255,255,.8)`,
      height: 32,
      width: 32 
    },
    iconContainer: {
      textAlign: 'center'
    },
    text: {
      color: `rgba(255,255,255,.8)`,
      fontWeight: 700,
      fontSize: '.8rem',
      textAlign: 'center',
      textTransform: 'uppercase'
    }
  })
);

/**
 * Renders the swipe helper component based on the direction provided.
 */
const SwipeHelper: React.FC<SwipeHelperProps> = (props: SwipeHelperProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  return (
    <React.Fragment>
      {props.direction === SwipeDirection.DOWN &&
        <Grid container direction='column'>
          <Grid item>
            <Typography className={clsx(classes.text)} variant='body1'>
              {props.title}
            </Typography>
          </Grid>
          <Grid className={clsx(classes.iconContainer)} item xs={12}>
            <DoubleArrowRoundedIcon  className={clsx(
              classes.icon,
              classes.arrowDown
            )}/>  
          </Grid>
        </Grid>
      }
      {props.direction === SwipeDirection.UP &&
        <Grid container direction='column'>
          <Grid className={clsx(classes.iconContainer)} item xs={12}>
            <DoubleArrowRoundedIcon  className={clsx(
              classes.icon,
              classes.arrowUp
            )}/>  
          </Grid>
          <Grid item>
            <Typography className={clsx(classes.text)} variant='body1'>
              {props.title}
            </Typography>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  );
}

export default SwipeHelper;

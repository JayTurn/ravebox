/**
 * StreamCardHolder.tsx
 * StreamCardHolder component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MobileStepper from '@material-ui/core/MobileStepper';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Components.
import StreamCard from '../card/StreamCard';

// Enumerators.
import { CardPosition } from '../card/StreamCard.enum';
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { StreamCardHolderProps } from './StreamCardHolder.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardsContainer: {
      overflow: 'hidden',
      position: 'relative',
      height: 340
    },
    cardStepper: {
      justifyContent: 'center'
    },
    container: {
      margin: theme.spacing(.5, 0),
      overflow: 'hidden',
      padding: theme.spacing(1)
    },
    productContainer: {
      margin: theme.spacing(.5, 0),
      padding: theme.spacing(0, 2)
    },
    productTitle: {
      fontSize: '1rem',
      fontWeight: 500
    },
    streamTitle: {
      color: theme.palette.text.secondary,
      fontSize: '.8rem',
      fontWeight: 800
    },
    streamTypeContainer: {
      padding: theme.spacing(1, 1, 0),
      marginBottom: theme.spacing(1)
    }
  })
);

/**
 * Handles changing the position of the card based on the active index.
 *
 * @param { number } activeIndex - the active index.
 * @param { number } index - the index of this item.
 *
 * @return CardPosition
 */
const setCardPosition: (
  activeIndex: number
) => (
  index: number
) => CardPosition = (
  activeIndex: number
) => (
  index: number
): CardPosition => {
  if (index < activeIndex) {
    return CardPosition.PREVIOUS;
  }
  if (index > activeIndex) {
    return CardPosition.NEXT;
  }

  return CardPosition.SHOWING
}

/**
 * Renders the component that holds and controls rave stream cards.
 */
const StreamCardHolder: React.FC<StreamCardHolderProps> = (
  props: StreamCardHolderProps
) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  return (
    <Grid container className={clsx(classes.container)}>
      {props.streamType !== RaveStreamType.PRODUCT &&
        <Grid item xs={12} className={clsx(classes.streamTypeContainer)}>
          <Grid container alignItems='center' justify='space-between'>
            <Grid item>
              <Typography variant='h2' className={clsx(classes.streamTitle)}>
                #{props.title}
              </Typography>
            </Grid>
            <Grid item>
              View all
            </Grid>
          </Grid>
        </Grid>
      }
      {props.reviews.length > 0 &&
        <React.Fragment>
          <Grid item xs={12} className={classes.cardsContainer}>
            {props.reviews.map((review: Review, index: number) => (
              <React.Fragment key={index}>
                {index > activeIndex - 2 && index < activeIndex + 2 &&
                  <StreamCard
                    active={index === activeIndex}
                    positioning={setCardPosition(activeIndex)(index)}
                    review={{...review}}
                    streamType={props.streamType}
                  />
                }
              </React.Fragment>
            ))}
          </Grid>
          <Grid item xs={12}>
            <MobileStepper
              activeStep={activeIndex}
              backButton={null}
              className={clsx(classes.cardStepper)}
              nextButton={null}
              position='static'
              variant='dots'
              steps={props.reviews.length}
            />
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
}

export default StreamCardHolder;

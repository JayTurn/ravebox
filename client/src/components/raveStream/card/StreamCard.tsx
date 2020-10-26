/**
 * StreamCard.tsx
 * StreamCard menu component.
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
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Components.
import CardVideo from '../cardVideo/CardVideo';

// Enumerators.
import { CardPosition } from './StreamCard.enum';
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { StreamCardProps } from './StreamCard.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    brandText: {
      display: 'block',
      fontSize: '.85rem',
      fontWeight: 700
    },
    cardContainer: {
    },
    container: {
      position: 'absolute',
      transition: 'transform 300ms ease-in-out',
      top: 0,
      width: '100%'
    },
    productContainer: {
      margin: theme.spacing(.5, 0),
      padding: theme.spacing(1, 2)
    },
    productTitle: {
      fontSize: '1.1rem',
      fontWeight: 500
    }
  })
);

/**
 * Returns a string or number based on the card positioning.
 *
 * @param { CardPosition } cardPosition
 *
 * @return string
 */
const setCardPosition: (
  cardPosition: CardPosition
) => string = (
  cardPosition: CardPosition
): string => {
  switch (cardPosition) {
    case CardPosition.PREVIOUS:
      return 'translate3d(-100%, 0, 0)';
    case CardPosition.NEXT:
      return 'translate3d(100%, 0, 0)';
    default:
      return 'translate3d(0, 0, 0)';
  }
};

/**
 * Renders the rave stream card.
 */
const StreamCard: React.FC<StreamCardProps> = (props: StreamCardProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    active,
    review,
    streamType
  } = {...props};

  return (
    <Box
      className={clsx(classes.container)}
      style={{transform: `${setCardPosition(props.positioning)}`}}
    >
      <Grid container className={clsx(classes.cardContainer)}>
        <Grid item xs={12}>
          <CardVideo review={{...review}} active={active} />  
        </Grid>
      </Grid>
    </Box>
  );
}

export default StreamCard;

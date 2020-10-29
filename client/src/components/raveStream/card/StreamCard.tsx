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
import { withRouter } from 'react-router';

// Components.
import CardUser from '../cardUser/CardUser';
import CardVideo from '../cardVideo/CardVideo';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { CardPosition } from './StreamCard.enum';
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { StreamCardProps } from './StreamCard.interface';

// Utilities.
import { buildURLForStream } from '../RaveStream.common';

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
    buttonElement: {
      //fontWeight: 700,
      '&.MuiButton-root': {
        //borderRadius: 20
      }
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
      padding: theme.spacing(0, 2, 1)
    },
    productTitle: {
      fontSize: '1.1rem',
      fontWeight: 500
    },
    userContainer: {
      padding: theme.spacing(1, 2)
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

  const path: string = buildURLForStream(streamType)(review)(true);

  /**
   * Handles navigation to the rave video.
   *
   * @param { React.SythenticEvent } e - the triggered event.
   */
  const handleNavigate: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    props.history.push(path);
  }

  return (
    <Box
      className={clsx(classes.container)}
      style={{transform: `${setCardPosition(props.positioning)}`}}
    >
      <Grid container className={clsx(classes.cardContainer)}>
        {streamType !== RaveStreamType.PRODUCT &&
          <Grid item xs={12} className={clsx(classes.productContainer)}>
            {review.product &&
              <Typography variant='h3' className={clsx(classes.productTitle)}>
                <Box component='span' className={clsx(classes.brandText)}>
                  {review.product.brand.name}
                </Box>
                {review.product.name}
              </Typography>
            }
          </Grid>
        }
        <Grid item xs={12}>
          <CardVideo
            active={active}
            playing={false}
            review={{...review}}
            url={path}
          />  
        </Grid>
        <Grid item xs={12} className={clsx(classes.userContainer)}>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <CardUser review={{...review}} />
            </Grid>
            <Grid item>
              <StyledButton
                className={clsx(classes.buttonElement)}
                clickAction={handleNavigate}
                color='primary'
                size='small'
                title='View rave'
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default withRouter(StreamCard);
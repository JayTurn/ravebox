/**
 * SwipeCard.tsx
 * SwipeCard menu component.
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
import { Link as ReactLink } from 'react-router-dom';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import CardUser from '../../raveStream/cardUser/CardUser';
import CardVideo from '../../raveStream/cardVideo/CardVideo';
import LinkElement from '../../elements/link/Link';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { CardPosition } from './SwipeCard.enum';
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { StyleType } from '../../elements/link/Link.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { SwipeCardProps } from './SwipeCard.interface';

// Utilities.
import { buildURLForStream } from '../../raveStream/RaveStream.common';

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
    productLink: {
      color: 'inherit',
      textDecoration: 'none'
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
const SwipeCard: React.FC<SwipeCardProps> = (props: SwipeCardProps) => {
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
              <ReactLink
                className={clsx(classes.productLink)}
                to={`/product/${review.product.brand.url}/${review.product.url}`}
                title={`View the ${review.product.brand.name} ${review.product.name} details`}
              >
                <Typography variant='h3' className={clsx(classes.productTitle)}>
                  <Box component='span' className={clsx(classes.brandText)}>
                    {review.product.brand.name}
                  </Box>
                  {review.product.name}
                </Typography>
              </ReactLink>
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
              <LinkElement
                className={clsx(classes.buttonElement)}
                title='Play rave'
                path={`${path}`}
                size='small'
                styleType={StyleType.BUTTON_PRIMARY}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default withRouter(SwipeCard);

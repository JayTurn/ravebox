/**
 * SwipeCardHolder.tsx
 * SwipeCardHolder component.
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
import {
  EventData,
  SwipeableHandlers,
  SwipeableOptions,
  useSwipeable
} from 'react-swipeable'
import Grid from '@material-ui/core/Grid';
import { Link as ReactLink } from 'react-router-dom';
import MobileStepper from '@material-ui/core/MobileStepper';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import LinkElement from '../../elements/link/Link';
import SwipeCard from '../card/SwipeCard';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { CardPosition } from '../card/SwipeCard.enum';
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { StyleType } from '../../elements/link/Link.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { SwipeCardHolderProps } from './SwipeCardHolder.interface';

// Utilities.
import { buildURLForStream } from '../../raveStream/RaveStream.common';
import { Pluralize } from '../../../utils/display/textFormats/TextFormats';

/**
 * Stepper styles.
 */
const StyledStepper = withStyles(theme => ({
  root: {
    backgroundColor: 'transparent',
    borderTop: `1px solid rgba(100, 106, 240, .15)`,
    justifyContent: 'center',
    padding: theme.spacing(1.5, 0)
  },
  dot: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.primary.main}`,
    height: 10,
    width: 10
  },
  dotActive: {
    backgroundColor: theme.palette.primary.main,
  }
}))(MobileStepper);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    brandText: {
      display: 'block',
      fontSize: '.85rem',
      fontWeight: 800
    },
    cardsContainer: {
      position: 'relative',
      height: 0,
      paddingTop: '88.25%'
    },
    cardStepper: {
      backgroundColor: 'transparent',
      justifyContent: 'center',
      '&.MuiMobileStepper-dot': {
        backgroundColor: theme.palette.secondary.light,
        border: `2px solid ${theme.palette.secondary.main}`,
        height: 10,
        width: 10
      }
    },
    container: {
      backgroundColor: theme.palette.common.white,
      //boxShadow: `0 -1px 0 rgba(100,106,240, .25)`,
      //boxShadow: `0px -1px 1px rgba(100,106,240,.15), 0px 1px 3px rgba(100,106,240,.25)`,
      margin: theme.spacing(1, 0, 0),
      overflow: 'hidden',
      padding: theme.spacing(0),
      position: 'relative'
    },
    productContainer: {
      margin: theme.spacing(.5, 0),
      padding: theme.spacing(0, 2)
    },
    productTitle: {
      fontSize: '1.1rem',
      fontWeight: 500,
      marginBottom: 0
    },
    streamLink: {
      color: 'inherit',
      textDecoration: 'none'
    },
    streamTitle: {
      //color: theme.palette.common.white,
      //color: theme.palette.primary.main,
      fontSize: '1.2rem',
      fontWeight: 800,
      margin: theme.spacing(.75, 0),
      textTransform: 'capitalize'
    },
    streamTitleContainer: {
      //borderTopRightRadius: 5,
      //borderBottomRightRadius: 5,
      //backgroundColor: theme.palette.primary.main,
      padding: theme.spacing(0, 1)
    },
    streamTypeContainer: {
      //backgroundColor: `rgba(100,106,240, .1)`,
      //boxShadow: `inset 0px -1px 2px rgba(100,106,240,.15)`,
      borderBottom: `1px solid rgba(100, 106, 240, .15)`,
      marginBottom: theme.spacing(1),
      padding: theme.spacing(1.25, 1)
      //marginBottom: theme.spacing(1)
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
const SwipeCardHolder: React.FC<SwipeCardHolderProps> = (
  props: SwipeCardHolderProps
) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    reviews,
    streamType
  } = {...props};

  const title: string = props.overrideTitle
    ? props.title
    : Pluralize(props.title);

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const path: string = buildURLForStream(
    streamType)(reviews[0])(false);

  /**
   * Handles swipe events.
   *
   * @param { EventData } eventData - the swipe event data.
   */
  const handleSwipe: (
    eventData: EventData
  ) => void = (
    eventData: EventData
  ): void => {

    switch (eventData.dir) {
      case 'Left':
        if (activeIndex + 1 < props.reviews.length) {
          setActiveIndex(activeIndex + 1);
        }
        break;
      case 'Right':
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        }
        break;
      default:
    }
  }

  /**
   * Handles navigation to the rave stream.
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

  const swipeableHandlers: SwipeableHandlers = useSwipeable({
    delta: 10,
    onSwiped: handleSwipe,
    preventDefaultTouchmoveEvent: false,
    trackMouse: true
  });

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12} className={clsx(classes.streamTypeContainer)}>
        <Grid container alignItems='center' justify='space-between'>
          <Grid item className={clsx(classes.streamTitleContainer)}>
            {streamType !== RaveStreamType.PRODUCT || props.overrideTitle ? (
              <Typography variant='h2' className={clsx(classes.streamTitle)}>
                {title}
              </Typography>
            ) : (
              <React.Fragment>
                {reviews && reviews.length > 0 && reviews[0].product &&
                  <ReactLink
                    className={clsx(classes.streamLink)}
                    to={`/product/${reviews[0].product.brand.url}/${reviews[0].product.url}`}
                    title={`View the ${reviews[0].product.brand.name} ${reviews[0].product.name} details`}
                  >
                    <Typography variant='h2' className={clsx(classes.productTitle)}>
                      <Box component='span' className={clsx(classes.brandText)}>
                        {reviews[0].product.brand.name}
                      </Box>
                      {reviews[0].product.name}
                    </Typography>
                  </ReactLink>
                }
              </React.Fragment>
            )}
          </Grid>
          {!props.hidePlayAll &&
            <Grid item>
              <LinkElement
                title='Play all'
                path={`${path}`}
                size='small'
                styleType={StyleType.BUTTON_PRIMARY_OUTLINE}
              />
            </Grid>
          }
        </Grid>
      </Grid>
      {props.reviews.length > 0 &&
        <React.Fragment>
          <Grid item xs={12}
            className={classes.cardsContainer}
            style={{paddingTop: streamType === RaveStreamType.PRODUCT ? `calc(82.5% + 40px)` : `calc(82.5% + 108px)`}}
          >
            <Box {...swipeableHandlers}>
              {props.reviews.map((review: Review, index: number) => (
                <React.Fragment key={index}>
                  {index > activeIndex - 2 && index < activeIndex + 2 &&
                    <SwipeCard
                      active={index === activeIndex}
                      positioning={setCardPosition(activeIndex)(index)}
                      review={{...review}}
                      streamType={props.streamType}
                    />
                  }
                </React.Fragment>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <StyledStepper
              activeStep={activeIndex}
              backButton={null}
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

export default withRouter(SwipeCardHolder);

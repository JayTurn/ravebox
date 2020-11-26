/**
 * DesktopCardHolder.tsx
 * DesktopCardHolder component.
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
import DesktopCard from '../card/DesktopCard';
import ProductTitle from '../../product/title/ProductTitle';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';

// Interfaces.
import { Product } from '../../product/Product.interface';
import { Review } from '../../review/Review.interface';
import { DesktopCardHolderProps } from './DesktopCardHolder.interface';

// Utilities.
import {
  buildURLForStream,
  getStreamName
} from '../../raveStream/RaveStream.common';
import { Pluralize } from '../../../utils/display/textFormats/TextFormats';

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
      margin: theme.spacing(0)
    },
    container: {
      backgroundColor: theme.palette.background.default,
      paddingTop: theme.spacing(2),
      position: 'relative',
    },
    productContainer: {
      margin: theme.spacing(.5, 0),
      padding: theme.spacing(0, 2)
    },
    streamLink: {
      color: 'inherit',
      textDecoration: 'none'
    },
    streamTitle: {
      fontSize: '1.1rem',
      fontWeight: 700,
      margin: theme.spacing(.75, 0),
      textTransform: 'uppercase'
    },
    streamTitleContainer: {
      padding: theme.spacing(0, 1)
    },
    streamTypeContainer: {
      padding: theme.spacing(0, 1)
    },
    streamTypeTitle: {
      backgroundColor: theme.palette.secondary.dark,
      borderRadius: 20,
      color: theme.palette.common.white,
      display: 'inline-block',
      margin: theme.spacing(.5, 1),
      padding: theme.spacing(0, 1),
      lineHeight: 2,
      fontSize: '.7rem',
      fontWeight: 700,
      textTransform: 'uppercase'
    },
  })
);

/**
 * Renders the component that holds and controls rave stream cards.
 */
const DesktopCardHolder: React.FC<DesktopCardHolderProps> = (
  props: DesktopCardHolderProps
) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    reviews,
    streamType,
  } = {...props};

  const title: string = Pluralize(props.title);

  const path: string = buildURLForStream(
    streamType)(reviews[0])(false);

  const product: Product | undefined = reviews && reviews.length > 0
    ? reviews[0].product
    : undefined;

  const streamName: string = getStreamName(streamType);

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

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12} className={clsx(classes.streamTypeContainer)}>
        <Grid container alignItems='flex-end'>
          <Grid item className={clsx(classes.streamTitleContainer)}>
            {streamType !== RaveStreamType.PRODUCT || props.overrideTitle ? (
              <ReactLink
                className={clsx(classes.streamLink)}
                to={path}
                title={`View all raves for the ${title} category`}
              >
                <Typography variant='h2' className={clsx(classes.streamTitle)}>
                  {title}
                </Typography>
              </ReactLink>
            ) : (
              <React.Fragment>
                {product &&
                  <ProductTitle product={{...product}} linkTitle={true} />
                }
              </React.Fragment>
            )}
          </Grid>
          {!props.hideStreamTag &&
            <Grid item xs={12}>
              <Typography className={clsx(classes.streamTypeTitle)} variant='body1'>
                {streamName}
              </Typography>
            </Grid>
          }
          {/*
          <Grid item>
            <StyledButton
              clickAction={handleNavigate}
              size='small'
              title='View Stream'
              variant='outlined'
            />
          </Grid>
          */}
        </Grid>
      </Grid>
      {props.reviews.length > 0 &&
        <Grid item xs={12}
          className={classes.cardsContainer}
        >
          <Grid container justify='flex-start' alignItems='center'>
            {props.reviews.map((review: Review, index: number) => (
              <Grid item
                xs={props.xs || 12}
                sm={props.sm || 6}
                md={props.md || 3}
                lg={props.lg || 3}
                key={review._id}
              >
                <DesktopCard
                  hideProductTitles={props.hideProductTitles || false}
                  review={{...review}}
                  streamType={props.streamType}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      }
    </Grid>
  );
}

export default withRouter(DesktopCardHolder);

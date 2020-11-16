/**
 * DesktopRaveActions.tsx
 * Rave actions for the desktop stream.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TransitionGroup } from 'react-transition-group';
import * as React from 'react';

// Actions.
import {
  updateActive,
  updateProduct
} from '../../../store/raveStream/Actions';

// Components.
import DesktopVideo from '../video/DesktopVideo';
import ProductTitle from '../../product/title/ProductTitle';
import RateRave from '../../rateRave/RateRave';
import ShareButton from '../../share/ShareButton';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import {
  ShareStyle,
  ShareType
} from '../../share/ShareButton.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { EventObject } from '../../analytics/Analytics.interface';
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';
import {
  DesktopRaveActionsProps
} from './DesktopRaveActions.interface';

// Utilities.
import { emptyProduct } from '../../product/Product.common';
import {
  emptyReview,
  formatReviewProperties
} from '../../review/Review.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2)
    },
    rateContainer: {
      margin: theme.spacing(0, 2)
    },
    titleContainer: {
    },
  })
);

/**
 * Renders the controller which holds the videos in the stream.
 */
const DesktopRaveActions: React.FC<DesktopRaveActionsProps> = (props: DesktopRaveActionsProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    raveStream,
  } = {...props};

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [playing, setPlaying] = React.useState<boolean>(false);

  const activeIndex: number = props.activeIndex || 0;

  const review: Review | null = props.raveStream && props.raveStream.reviews[activeIndex]
    ? props.raveStream.reviews[activeIndex]
    : null;

  // Formats the review event data for tracking purposes.
  const [eventData, setEventData] = React.useState<EventObject>(
          formatReviewProperties(review || emptyReview()));

  return (
    <Grid
      alignItems='center'
      className={clsx(classes.container)}
      container
      justify='space-between'
    >
      {review && review.product && review.user &&
        <React.Fragment>
          <Grid item className={clsx(classes.titleContainer)}>
            <ProductTitle product={review.product} linkTitle={true} />
          </Grid>
          <Grid item>
            <Grid container>
              <Grid item className={clsx(classes.rateContainer)}>
                <RateRave review={{...review}} />
              </Grid>
              <Grid item>
                <ShareButton
                  eventData={eventData}
                  image={`${review.thumbnail}`}
                  shareStyle={ShareStyle.ICON}
                  shareType={ShareType.REVIEW}
                  title={`${review.product.brand.name} ${review.product.name} rave posted by ${review.user.handle}`}
                />
                
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the stream.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateActiveIndex: updateActive,
      updateProduct: updateProduct
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: DesktopRaveActionsProps) => {
  // Retrieve the product stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0,
        product: Product = state.raveStream ? state.raveStream.product : undefined;

  return {
    ...ownProps,
    activeIndex,
    product,
    raveStream
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DesktopRaveActions);

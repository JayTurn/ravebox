/**
 * DesktopVideoController.tsx
 * Video for the desktop stream component.
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
import StyledButton from '../../elements/buttons/StyledButton';
import DesktopVideo from '../video/DesktopVideo';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';
import {
  DesktopVideoControllerProps
} from './DesktopVideoController.interface';

// Utilities.
import { emptyProduct } from '../../product/Product.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
    },
    defaultColor: {
    },
    subtitle: {
    },
    videoContainer: {
      position: 'relative'
    }
  })
);

/**
 * Renders the controller which holds the videos in the stream.
 */
const DesktopVideoController: React.FC<DesktopVideoControllerProps> = (props: DesktopVideoControllerProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [playing, setPlaying] = React.useState<boolean>(false);

  const activeIndex: number = props.activeIndex || 0;

  const review: Review | null = props.raveStream && props.raveStream.reviews[activeIndex]
    ? props.raveStream.reviews[activeIndex]
    : null;

  /**
   * Handles moving to the next video.
   */
  const handleNext: (
  ) => void = (
  ): void => {
    if (props.updateActiveIndex && props.updateProduct) {
      if (props.raveStream && props.raveStream.reviews.length > 0) {
        if ((activeIndex + 1) < props.raveStream.reviews.length) {
          props.updateProduct(
            props.raveStream.reviews[activeIndex + 1].product || emptyProduct()
          );
          props.updateActiveIndex(activeIndex + 1);
        }
      }
    }
  }

  const handlePrevious: (
  ) => void = (
  ): void => {
    if (props.updateActiveIndex && props.updateProduct) {
      if (props.raveStream && props.raveStream.reviews.length > 0) {
        if ((activeIndex - 1) >= 0) {
          props.updateProduct(
            props.raveStream.reviews[activeIndex - 1].product || emptyProduct()
          );
          props.updateActiveIndex(activeIndex - 1);
        }
      }
    }
  }

  /**
   * Handles playing and pausing video.
   */
  const handlePlayPause: (
    playState: boolean
  ) => void = (
    playState: boolean
  ): void => {
    setPlaying(playState);
  }

  return (
    <Grid
      className={clsx(classes.container)}
      container
    >
      {props.raveStream &&
        <Grid item xs={12} className={clsx(classes.videoContainer)}>
          {review &&
            <DesktopVideo
              playing={playing}
              review={review}
            />
          }
        </Grid>
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
const mapStateToProps = (state: any, ownProps: DesktopVideoControllerProps) => {
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
)(DesktopVideoController);

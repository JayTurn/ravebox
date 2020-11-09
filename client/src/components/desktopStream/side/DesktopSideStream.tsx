/**
 * DesktopSideStream.tsx
 * Product details for the stream component.
 */

// Modules.
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
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.
import ProductTitle from '../../product/title/ProductTitle';
import SideCard from '../sideCard/SideCard';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  DesktopSideStreamProps
} from './DesktopSideStream.interface';
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

// Utilities.
import {
  buildContextPath,
  getStreamName
} from '../../raveStream/RaveStream.common';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main
  },
  root: {
    //borderBottom: `1px solid ${theme.palette.secondary.main}`
  }
}))(Tabs);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      //backgroundColor: `rgba(100,106,240, .1)`,
    },
    paddedContent: {
      padding: theme.spacing(0, 1)
    },
    sideCardHolder: {
      //boxShadow: `0px 1px 3px rgba(100,106,240,.25), 0px -1px 1px rgba(100,106,240,.15)`,
      margin: theme.spacing(.5, 0)
    },
    similarTitle: {
      color: theme.palette.primary.dark,
      fontSize: '1rem',
      fontWeight: 700,
      textTransform: 'uppercase'
    },
    similarTitleContainer: {
      textAlign: 'center',
      margin: theme.spacing(1, 0)
    },
    streamTypeTitle: {
      backgroundColor: theme.palette.secondary.dark,
      borderRadius: 20,
      color: theme.palette.common.white,
      display: 'inline-block',
      margin: theme.spacing(1, 0),
      padding: theme.spacing(0, 1),
      lineHeight: '1.5rem',
      fontSize: '.7rem',
      fontWeight: 700,
      textTransform: 'uppercase'
    },
    streamTitle: {
      textTransform: 'uppercase',
      fontWeight: 700
    },
    subtitle: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: 600
    },
    title: {
      fontWeight: 400,
      margin: theme.spacing(0)
    },
    titleContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 10,
      margin: theme.spacing(2, 1)
    },
  })
);

/**
 * Renders the product details in the stream.
 */
const DesktopSideStream: React.FC<DesktopSideStreamProps> = (props: DesktopSideStreamProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [reviewId, setReviewId] = React.useState<string>('');

  const {
    activeIndex,
    raveStream
  } = {...props};

  const streamName: string = raveStream
    ? getStreamName(raveStream.streamType)
    : '';

  const contextPath: string = raveStream ? buildContextPath(
    raveStream.streamType)(props.match.params) : '';

  /**
   * Update the height on the first load.
   */
  React.useEffect(() => {
    if (props.review && props.review._id !== reviewId) {
      setReviewId(props.review._id);
    }
  }, [props.review, reviewId]);

  return (
    <Grid
      className={clsx(classes.container)}
      container
    >
      {raveStream &&
        <React.Fragment>
          <Grid item xs={12} className={clsx(
            classes.paddedContent,
            classes.titleContainer
          )}>
            { raveStream.streamType === RaveStreamType.PRODUCT ? (
              <ProductTitle product={props.product} />
            ) : (
              <Typography className={clsx(
                classes.title,
                classes.streamTitle
              )} variant='h2'>
                {raveStream.title}
              </Typography>
            )}
            <Typography className={clsx(classes.streamTypeTitle)} variant='body1'>
              {streamName} stream
            </Typography>
          </Grid>
          {raveStream.reviews.length > 0 &&
            <Grid item xs={12} className={clsx(classes.sideCardHolder)}>
              {raveStream.reviews.map((review: Review, index: number) => {
                if ((typeof activeIndex === 'number') && index > activeIndex) {
                  return (
                    <React.Fragment key={index}>
                      <SideCard
                        contextPath={contextPath}
                        next={activeIndex + 1 === index}
                        review={review} 
                        streamType={raveStream.streamType}
                      />
                    </React.Fragment>
                  );
                }
              })}
            </Grid>
          }
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: DesktopSideStreamProps) => {
  // Retrieve the current stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined;

  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  return {
    ...ownProps,
    activeIndex,
    raveStream,
    review
  };
};

export default withRouter(connect(
  mapStateToProps
)(DesktopSideStream));

/**
 * StreamProductDetails.tsx
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
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import StreamNavigation from '../navigation/StreamNavigation';
import ProductImages from '../productImages/ProductImages';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  StreamProductDetailsProps
} from './StreamProductDetails.interface';
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      height: 'calc(100vh)',
      overflowY: 'auto'
    },
    paddedContent: {
      padding: theme.spacing(0, 1) 
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600
    },
    title: {
      fontWeight: 400
    },
    titleContainer: {
      margin: theme.spacing(1, 0),
    },
  })
);

/**
 * Renders the product details in the stream.
 */
const StreamProductDetails: React.FC<StreamProductDetailsProps> = (props: StreamProductDetailsProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        {props.raveStream &&
          <StreamNavigation
            title={props.raveStream.title} 
            variant='colored'
          />  
        }
        {props.product.images && props.product.images.length > 0 &&
          <ProductImages images={props.product.images} />
        }
        <Grid container>
          <Grid item xs={12} className={clsx(
            classes.paddedContent,
            classes.titleContainer
          )}>
            <Typography className={clsx(classes.title)} variant='h2'>
              <Box className={clsx(classes.subtitle)}>{props.product.brand.name}</Box>
              {props.product.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: StreamProductDetailsProps) => {
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

export default connect(
  mapStateToProps
)(StreamProductDetails);

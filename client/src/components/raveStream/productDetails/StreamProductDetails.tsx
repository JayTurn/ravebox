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
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import StreamNavigation from '../navigation/StreamNavigation';
import ProductInformation from '../productInformation/ProductInformation';
import RaveInformation from '../raveInformation/RaveInformation';

// Enumerators.
import { ProductStreamSection } from './StreamProductDetails.enum';
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
      backgroundColor: theme.palette.background.default,
      height: 'calc(100vh)',
      overflowY: 'auto',
      paddingBottom: theme.spacing(9)
    },
    paddedContent: {
      padding: theme.spacing(0, 1)
    },
    subtitle: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: 600
    },
    tabPanelContainer: {
      boxShadow: `inset 0px -1px 3px rgba(100,106,240,.25), inset 0px 1px 1px rgba(100,106,240,.15)`,
      backgroundColor: `rgba(100,106,240, .1)`,
      padding: theme.spacing(1, 0)
    },
    title: {
      fontWeight: 400,
      marginBottom: 0
    },
    titleContainer: {
      margin: theme.spacing(2, 0, 1),
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

  const [activeTab, setActiveTab] = React.useState<ProductStreamSection>(
    ProductStreamSection.RAVES);

  /**
   * Handles switching between tabs.
   *
   * @param { ProductStreamSection } value - the selected product section.
   */
  const handleTabSwitch: (
    value: ProductStreamSection
  ) => void = (
    value: ProductStreamSection
  ): void => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
  }

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        <StreamNavigation
          title={props.raveStream ? props.raveStream.title : ''}
          variant='colored'
        />
        <Grid container>
          <Grid item xs={12} className={clsx(
            classes.paddedContent,
            classes.titleContainer
          )}>
            <Typography className={clsx(classes.title)} variant='h2'>
              <Box component='span' className={clsx(classes.subtitle)}>{props.product.brand.name}</Box>
              {props.product.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <StyledTabs
              value={activeTab}
              variant='scrollable'
            >
              <Tab
                disableRipple
                id={`product-section-${ProductStreamSection.RAVES}`}
                label='Rave Details'
                onClick={(e: React.SyntheticEvent) => 
                  handleTabSwitch(ProductStreamSection.RAVES)
                }
                value={ProductStreamSection.RAVES}
              />
              <Tab
                disableRipple
                id={`product-section-${ProductStreamSection.DETAILS}`}
                label='Product Details'
                onClick={(e: React.SyntheticEvent) => 
                  handleTabSwitch(ProductStreamSection.DETAILS)
                }
                value={ProductStreamSection.DETAILS}
              />
              <Tab
                disableRipple
                id={`product-section-${ProductStreamSection.SIMILAR}`}
                label='Similar products'
                onClick={(e: React.SyntheticEvent) => 
                  handleTabSwitch(ProductStreamSection.SIMILAR)
                }
                value={ProductStreamSection.SIMILAR}
              />
            </StyledTabs>
          </Grid>
        </Grid>
        <Grid container className={clsx(classes.tabPanelContainer)}>
          <Grid item xs={12}>
            <SwipeableViews
              axis={'x'}
              disabled={true}
              index={activeTab}
              onChangeIndex={handleTabSwitch}
            >
              <RaveInformation
                index={ProductStreamSection.RAVES}
                product={props.product}
                value={activeTab}
              />
              <ProductInformation
                index={ProductStreamSection.DETAILS}
                product={props.product}
                value={activeTab}
              />
            </SwipeableViews>
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

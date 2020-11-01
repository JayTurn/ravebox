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
import SimilarProducts from '../similarProducts/SimilarProducts';

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
    tab: {
      float: 'left',
      width: 'calc(100% / 3)'
    },
    tabContainer: {
    },
    tabPanel: {
      position: 'absolute',
      top: 0,
      transition: 'transform 300ms ease-in-out',
      width: `300%`
    },
    tabPanelContainer: {
      boxShadow: `inset 0px -1px 3px rgba(100,106,240,.25), inset 0px 1px 1px rgba(100,106,240,.15)`,
      backgroundColor: `rgba(100,106,240, .1)`,
      overflow: 'hidden',
      padding: theme.spacing(1, 0),
      position: 'relative',
      width: '100%'
    },
    tabs: {
      flexWrap: 'nowrap'
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
 * Returns a string or number based on the active tab.
 *
 * @param { ProductStreamSection } showing
 *
 * @return string
 */
const setProductSection: (
  showing: ProductStreamSection
) => string = (
  showing: ProductStreamSection
): string => {
  let value: number = 0;
  switch (showing) {
    case ProductStreamSection.RAVES:
      return 'translate3d(0, 0, 0)';
    case ProductStreamSection.DETAILS:
      value = 100 / 3;
      return `translate3d(calc(-${value}%), 0, 0)`;
    case ProductStreamSection.SIMILAR:
      value = (100 / 3) * 2;
      return `translate3d(calc(-${value}%), 0, 0)`;
    default:
      return 'translate3d(0, 0, 0)';
  }
};

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

  const [tabHeight, setTabHeight] = React.useState<number>(0);

  const [reviewId, setReviewId] = React.useState<string>('');

  const [raveInfoHeight, setRaveInfoHeight] = React.useState<number | null>(null);
  const [productDetailsHeight, setProductDetailsHeight] = React.useState<number | null>(null);
  const [similarProductsHeight, setSimilarProductsHeight] = React.useState<number | null>(null);

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
    updateTabHeight(value);
  }

  /**
   * Handles updates to the container height.
   *
   * @param { number } - the height to set the container.
   */
  const updateTabHeight: (
    value: ProductStreamSection
  ) => void = (
    value: ProductStreamSection
  ): void => {

    switch (value) {
      case ProductStreamSection.RAVES:
        if (raveInfoHeight) {
          setTabHeight(raveInfoHeight);
        }
        break;
      case ProductStreamSection.DETAILS:
        if (productDetailsHeight) {
          setTabHeight(productDetailsHeight);
        }
        break;
      case ProductStreamSection.SIMILAR:
        if (similarProductsHeight) {
          setTabHeight(similarProductsHeight);
        }
        break;
      default:
    }
  }

  /**
   * Handles updating the rave information height.
   */
  const handleRaveInfoHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setRaveInfoHeight(value);

    if (activeTab === ProductStreamSection.RAVES) {
      setTabHeight(value);
    }
  }

  /**
   * Handles updating the product details height.
   */
  const handleProductDetailsHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setProductDetailsHeight(value);

    if (activeTab === ProductStreamSection.DETAILS) {
      setTabHeight(value);
    }
  }

  /**
   * Handles updating the similar products height.
   */
  const handleSimilarProductsHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setSimilarProductsHeight(value);

    if (activeTab === ProductStreamSection.SIMILAR) {
      setTabHeight(value);
    }
  }

  /**
   * Update the height on the first load.
   */
  React.useEffect(() => {
    if (props.review && props.review._id !== reviewId) {
      setReviewId(props.review._id);
      setActiveTab(ProductStreamSection.RAVES);
    }
  }, [props.review, reviewId]);

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
        <Box
          className={clsx(classes.tabPanelContainer)}
          style={{height: tabHeight}}
        >
          <Box
            className={clsx(classes.tabPanel)}
            style={{
              height: tabHeight,
              transform: `${setProductSection(activeTab)}`
            }}
          >
            <div
              className={clsx(classes.tab)}
            >
              <RaveInformation
                index={ProductStreamSection.RAVES}
                product={props.product}
                updateHeight={handleRaveInfoHeightUpdate}
                value={activeTab}
              />
            </div>
            <div
              className={clsx(classes.tab)}
            >
              <ProductInformation
                index={ProductStreamSection.DETAILS}
                product={props.product}
                updateHeight={handleProductDetailsHeightUpdate}
                value={activeTab}
              />
            </div>
            <div
              className={clsx(classes.tab)}
            >
              <SimilarProducts
                product={props.product}
                updateHeight={handleSimilarProductsHeightUpdate}
              />
            </div>
          </Box>
        </Box>
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

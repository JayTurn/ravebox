/**
 * DesktopProductTab.tsx
 * Desktop product tab component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import DesktopCardHolder from '../cardHolder/DesktopCardHolder';
import DesktopProductImages from '../productImages/DesktopProductImages';
import ProductSpecifications from '../../raveStream/productSpecifications/ProductSpecifications';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';

// Hooks.
import { useRetrieveRaveStreamByProduct } from '../../raveStream/useRetrieveRaveStreamByProduct.hook';

// Interfaces.
import { DesktopProductTabProps } from './DesktopProductTab.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: `rgba(100, 106, 240, .1)`
    },
    cardContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      margin: theme.spacing(2)
    },
    noInformationText: {
      fontSize: '1.2rem',
      padding: theme.spacing(8, 4),
      textAlign: 'center'
    },
    raveContainer: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(0, 1)
    }
  })
);

/**
 * Renders the rave information.
 */
const DesktopProductTab: React.FC<DesktopProductTabProps> = (props: DesktopProductTabProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    productStream,
    raveStreamsStatus
  } = useRetrieveRaveStreamByProduct({
    product: props.product
  });

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [productId, setProductId] = React.useState<string>('');

  const [height, setHeight] = React.useState<number>(0);

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      if (ref.current.clientHeight < 600) {
        setHeight(600);
        props.updateHeight(600);
      } else {
        setHeight(ref.current.clientHeight);
        props.updateHeight(ref.current.clientHeight + 30);
      }
    }
  }

  /**
   * Returns the height of the element when it is loaded.
   */
  React.useEffect(() => {
    if (ref && ref.current) {
      if (height !== ref.current.clientHeight) {
        handleHeightUpdate();
      }
      if (props.product._id !== productId) {
        setProductId(props.product._id);
        handleHeightUpdate();
      }
    }
  }, [height, ref, props.product, productId]);

  return (
    <React.Fragment>
      {props.product.description || (props.product.images && props.product.images.length > 0) ? ( 
        <Grid className={clsx(classes.container)} container ref={ref}>
          <Grid item xs={12} className={clsx(classes.cardContainer)}>
            <ProductSpecifications
              description={props.product.description}
              updateHeight={handleHeightUpdate}
              website={props.product.website}
            />
          </Grid>
          {props.product.images && props.product.images.length > 0 &&
            <DesktopProductImages images={props.product.images} />
          }
          {productStream && productStream.reviews &&
            <Grid item xs={12} className={clsx(classes.raveContainer)}>
              <DesktopCardHolder
                lg={4}
                md={6}
                sm={12}
                hideStreamTag={true}
                overrideTitle={true}
                reviews={productStream.reviews ? [...productStream.reviews] : []}
                streamType={RaveStreamType.PRODUCT} 
                title={`More ${productStream.title} raves`}
              />
            </Grid>
          }
        </Grid>
      ) : (
        <Grid container ref={ref}>
          <Grid item xs={12}>
            <Typography variant='body1' className={clsx(classes.noInformationText)}>
              Further information for this product is coming soon.
            </Typography>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: DesktopProductTabProps) => {

  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps
)(DesktopProductTab);

/**
 * ProductInformation.tsx
 * Rave information component.
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
import ProductSpecifications from '../productSpecifications/ProductSpecifications';
import ProductImages from '../productImages/ProductImages';
import SwipeCardHolder from '../../swipeStream/cardHolder/SwipeCardHolder';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Hooks.
import { useRetrieveRaveStreamByProduct } from '../useRetrieveRaveStreamByProduct.hook';

// Interfaces.
import { ProductInformationProps } from './ProductInformation.interface';
import { RaveStream } from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
    },
    cardContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      margin: theme.spacing(1)
    }
  })
);

/**
 * Renders the rave information.
 */
const ProductInformation: React.FC<ProductInformationProps> = (props: ProductInformationProps) => {
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
    <Grid className={clsx(classes.container)} container ref={ref}>
      <Grid item xs={12} className={clsx(classes.cardContainer)}>
        <ProductSpecifications
          description={props.product.description}
          updateHeight={handleHeightUpdate}
          website={props.product.website}
        />
      </Grid>
      {props.product.images && props.product.images.length > 0 &&
        <ProductImages images={props.product.images} />
      }
      {productStream && productStream.reviews &&
        <SwipeCardHolder
          reviews={productStream.reviews ? [...productStream.reviews] : []}
          streamType={RaveStreamType.PRODUCT} 
          title={`${productStream.title}`}
        />
      }
    </Grid>
  );
};

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ProductInformationProps) => {

  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps
)(ProductInformation);

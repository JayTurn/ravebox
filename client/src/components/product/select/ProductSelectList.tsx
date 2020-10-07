/**
 * ProductSelectList.tsx.
 * Component for selecting a product from a display list.
 */

// Modules.
import * as React from 'react';
import Box from '@material-ui/core/List';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import Zoom from '@material-ui/core/Zoom';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { CategoryItem } from '../../category/Category.interface';
import { Product, ProductGroup } from '../Product.interface';
import { ProductSelectListProps } from './ProductSelectList.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  backgroundContainer: {
    backgroundColor: 'rgba(100, 106, 240, 0.1)',
    borderRadius: theme.shape.borderRadius,
    marginTop: '0.5rem'
  },
  container: {
    height: '100%'
  },
  list: {
    padding: '0.1rem 1rem'
  },
  listItem: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: `0 1px 1px rgba(100,106,240, 0.25)`,
    paddingBottom: '.5rem',
    paddingTop: '.5rem',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.common.white
    }
  },
  listBox: {
    flexDirection: 'column'
  },
  productBrand: {
    fontSize: '.9rem',
    fontWeight: 500
  },
  productName: {
    fontSize: '1.15rem',
    fontWeight: 500
  },
  productTypeName: {
    fontWeight: 400
  }
}));

/**
 * Assists the user in the selection of a product.
 */
const ProductSelectList: React.FC<ProductSelectListProps> = (props: ProductSelectListProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Use the custom styles.
  const classes = useStyles();

  /**
   * Redirect the user to the review screen for this product.
   *
   * @param { string } id - the product id.
   */
  const selectProduct: (
    index: number
  ) => void = (
    index: number
  ): void => {

    const product: Product = {...props.products[index]};

    // Create the event object from the provided values.
    const eventData: EventObject = {
      'brand id': product.brand._id,
      'brand name': product.brand.name,
      'product id': product._id,
      'product name': product.name
    };

    analytics.trackEvent(`select existing product`)(eventData);

    props.select(product);
  }

  return (
    <Grid
      className={classes.container}
      container
      alignItems='stretch'
    >
      <Fade in={props.products && props.products.length > 0}>
        <Grid item xs={12} className={classes.backgroundContainer}>
          {props.products && props.products.length > 0 &&
            <Grow in={props.products.length > 0}>
              <List className={classes.list}>
                {props.products.map((product: Product, index: number) => {
                  const added: boolean = true;
                  return (
                    <Zoom 
                      in={added}
                      style={{transitionDelay: added ? `${100 * index}ms`: `100ms`}}
                      key={product._id}
                    >
                      <ListItem
                        button
                        className={classes.listItem}
                        disableRipple
                        onClick={() => selectProduct(index)}
                      >
                        <Box component='div'>
                          <Typography variant='body2' color='textPrimary' className={classes.productBrand}>
                            {product.brand.name}
                          </Typography>
                          <Typography variant='body1' color='textPrimary' className={classes.productName}>
                            {product.name}
                          </Typography>
                          {product.productType &&
                            <Typography variant='subtitle2' color='textPrimary' className={classes.productTypeName}>
                              {product.productType.name}
                            </Typography>
                          }
                        </Box>
                      </ListItem>
                    </Zoom>
                  )
                })}
              </List>
            </Grow>
          }
        </Grid>
      </Fade>
    </Grid>
  )
}

export default withRouter(ProductSelectList);

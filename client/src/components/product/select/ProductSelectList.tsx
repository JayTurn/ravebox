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
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import Zoom from '@material-ui/core/Zoom';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { Product, ProductGroup } from '../Product.interface';
import { ProductSelectListProps } from './ProductSelectList.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  list: {
    backgroundColor: 'rgba(100, 106, 240, 0.1)',
    borderRadius: theme.shape.borderRadius,
    marginTop: '0.5rem',
    padding: '0.1rem 1rem'
  },
  listItem: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: `0 1px 1px rgba(100,106,240, 0.25)`,
    paddingBottom: '.5rem',
    paddingTop: '.5rem',
    marginBottom: '1rem',
    marginTop: '1rem',
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
  cateogryName: {
    fontWeight: 400
  }
}));

/**
 * Assists the user in the selection of a product.
 */
const ProductSelectList: React.FC<ProductSelectListProps> = (props: ProductSelectListProps) => {

  // Use the custom styles.
  const classes = useStyles();

  /**
   * Redirect the user to the review screen for this product.
   *
   * @param { string } id - the product id.
   */
  const selectProduct: (
    id: string
  ) => void = (
    id: string
  ): void => {
    props.history.push(`/product/${id}/review`);
  }

  return (
    <React.Fragment>
      {props.products && props.products.length > 0 &&
        <Grow in={props.products.length > 0}>
          <List className={classes.list}>
            {props.products.map((product: Product, index: number) => {
              const added: boolean = true;
              return (
                <Zoom 
                  in={added}
                  style={{transitionDelay: added ? `${100 * index}ms`: `100ms`}}
                >
                  <ListItem
                    button
                    className={classes.listItem}
                    disableRipple
                    key={product._id}
                    onClick={() => selectProduct(product._id)}
                  >
                    <Box component='div'>
                      <Typography variant='body2' color='textPrimary' className={classes.productBrand}>
                        {product.brand}
                      </Typography>
                      <Typography variant='body1' color='textPrimary' className={classes.productName}>
                        {product.name}
                      </Typography>
                      <Typography variant='subtitle2' color='textPrimary' className={classes.cateogryName}>
                        {product.categories[0].label}
                      </Typography>
                    </Box>
                  </ListItem>
                </Zoom>
              )
            })}
          </List>
        </Grow>
      }
    </React.Fragment>
  )
}

export default withRouter(ProductSelectList);

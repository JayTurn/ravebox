/**
 * ProductPreview.tsx
 * Preview component of the product details.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { ProductPreviewProps } from './ProductPreview.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: { },
  productName: {
    fontSize: '1rem',
    fontWeight: 600
  },
  productNameLarge: {
    fontSize: '1.1rem'
  },
  productBrand: {
    fontSize: '.8rem',
    fontWeight: 600
  },
  productBrandLarge: {
    fontSize: '.9rem'
  },
  title: {
    color: '#3E42A3'
  },
  titleContainer: {
  }
}));

/**
 * Renders the product preview card component.
 */
const ProductPreview: React.FC<ProductPreviewProps> = (
  props: ProductPreviewProps
) => {

  // Use the custom styles.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid
      container
      direction='column'
      className={classes.container}
    >
      <Grid item xs={12} lg={6}>
        <Typography variant='body2' className={clsx(
          classes.productBrand, {
            [classes.productBrandLarge]: largeScreen
          }
        )}>
          {props.brand}
        </Typography>
        <Typography variant='body1' className={clsx(
          classes.productName, {
            [classes.productNameLarge]: largeScreen
          })}
        >
          {props.name}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProductPreview;

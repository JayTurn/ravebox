/**
 * ProductTitle.tsx
 * Product title component.
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

// Interfaces.
import { ProductTitleProps } from './ProductTitle.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    brandName: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: 700
    },
    productName: {
      fontSize: '1.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
      marginBottom: 0
    }
  })
);

/**
 * Renders the product title in the component.
 */
const ProductTitle: React.FC<ProductTitleProps> = (props: ProductTitleProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  /**
   * Render the product title JSX.
   */
  return (
    <Grid container>
      {props.product &&
        <Grid item xs={12}>
          <Typography className={clsx(classes.productName)} variant={props.variant || 'h2'}>
            <Box component='span' className={clsx(classes.brandName)}>{props.product.brand.name}</Box>
            {props.product.name}
          </Typography>
        </Grid>
      }
    </Grid>
  );
};

export default ProductTitle;

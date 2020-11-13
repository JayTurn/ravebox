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
import { Link as ReactLink } from 'react-router-dom';
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
      fontSize: '0.65em',
      fontWeight: 700
    },
    productLink: {
      color: 'inherit',
      textDecoration: 'none'
    },
    productName: {
      fontSize: '1.6rem',
      fontWeight: 300,
      lineHeight: 1.1,
      marginBottom: 0
    },
    productNameLarge: {
      fontSize: '1.8rem', 
    },
    productNameSmall: {
      fontSize: '1.33rem'
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
          {props.linkTitle ? (
            <ReactLink
              className={clsx(classes.productLink)}
              to={`/product/${props.product.brand.url}/${props.product.url}`}
              title={`View the ${props.product.brand.name} ${props.product.name} details`}
            >
              <Typography className={clsx(
                classes.productName, {
                  [classes.productNameLarge]: props.size === 'large',
                  [classes.productNameSmall]: props.size === 'small'
                }
              )} variant={props.variant || 'h2'}>
                <Box component='span' className={clsx(classes.brandName)}>{props.product.brand.name}</Box>
                {props.product.name}
              </Typography>
            </ReactLink>
          ) : (
            <Typography className={clsx(
              classes.productName, {
                [classes.productNameLarge]: props.size === 'large',
                [classes.productNameSmall]: props.size === 'small'
              }
            )} variant={props.variant || 'h2'}>
              <Box component='span' className={clsx(classes.brandName)}>{props.product.brand.name}</Box>
              {props.product.name}
            </Typography>
          )}
        </Grid>
      }
    </Grid>
  );
};

export default ProductTitle;

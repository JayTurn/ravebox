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
import { NavLink } from 'react-router-dom';
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
  container: {
    margin: theme.spacing(1, 0, 2)
  },
  containerItem: {
    backgroundColor: theme.palette.primary.dark,
    borderRadius: theme.shape.borderRadius,
    display: 'inline-block',
    minWidth: 270,
    padding: theme.spacing(1, 2),
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.short
    }),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    }
  },
  header: {
    color: '#3E42A3',
    fontSize: '1.1rem',
    fontWeight: 500
  },
  linkText: {
    color: theme.palette.common.white,
    textDecoration: 'none'
  },
  productName: {
    color: theme.palette.common.white,
    fontSize: '1rem',
    fontWeight: 600
  },
  productNameLarge: {
    fontSize: '1.1rem'
  },
  productBrand: {
    color: theme.palette.common.white,
    fontSize: '.8rem',
    fontWeight: 600,
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
      <Grid item xs={12} lg={12}>
        <Typography variant='h2' className={clsx(classes.header)}>
          Product details
        </Typography>
        
        <NavLink to={`/product/${props.url}`} className={classes.linkText}>
          <Box
            className={classes.containerItem}
          >
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
          </Box>
        </NavLink>
      </Grid>
    </Grid>
  );
}

export default ProductPreview;

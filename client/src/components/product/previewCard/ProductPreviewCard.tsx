/**
 * ProductPreviewCard.tsx
 * Preview card component of the product details.
 */

// Modules.
import Box from '@material-ui/core/Box';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { ProductPreviewCardProps } from './ProductPreviewCard.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  cateogryName: {
    fontWeight: 400
  },
  container: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: `0 1px 1px rgba(100,106,240, 0.25)`,
    padding: '1rem'
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: 500,
    marginBottom: '.75rem'
  },
  productBrand: {
    fontSize: '.7rem',
    fontWeight: 500,
    textTransform: 'uppercase'
  },
  title: {
    color: '#3E42A3',
    marginBottom: '1rem'
  },
  wrapper: {
    backgroundColor: 'rgba(100, 106, 240, 0.1)',
    borderRadius: theme.shape.borderRadius,
    marginBottom: '2rem',
    padding: '1rem'
  }
}));

/**
 * Renders the product preview card component.
 */
const ProductPreviewCard: React.FC<ProductPreviewCardProps> = (
  props: ProductPreviewCardProps
) => {

  // Use the custom styles.
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} lg={6} className={classes.wrapper}>
        <Typography variant='h3' className={classes.title}>
          Product 
        </Typography>
        <Box component='div' className={classes.container}>
          <Typography variant='body2' className={classes.productBrand}>
            {props.brand}
          </Typography>
          <Typography variant='body1' className={classes.productName}>
            {props.name}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}

export default ProductPreviewCard;

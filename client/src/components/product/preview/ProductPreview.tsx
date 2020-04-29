/**
 * ProductPreview.tsx
 * Preview component of the product details.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
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
import { ProductPreviewProps } from './ProductPreview.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  categoryChip: {
    borderRadius: theme.shape.borderRadius,
    fontWeight: 600,
    margin: theme.spacing(.5),
    '&:first-child': {
      marginLeft: 0
    },
    '&:last-child': {
      marginRight: 0
    }
  },
  container: {
    padding: theme.spacing(1)
  },
  productName: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1)
  },
  productBrand: {
    fontSize: '.8rem',
    fontWeight: 600
  },
  title: {
    color: '#3E42A3',
    marginBottom: '1rem'
  },
  wrapper: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 1, 1.5),
    borderBottom: `2px solid ${theme.palette.secondary.light}`
  }
}));

/**
 * Renders the product preview card component.
 */
const ProductPreview: React.FC<ProductPreviewProps> = (
  props: ProductPreviewProps
) => {

  // Use the custom styles.
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      className={classes.wrapper}
    >
      <Grid item xs={12} lg={6}>
        <Typography variant='body2' className={classes.productBrand}>
          {props.brand}
        </Typography>
        <Typography variant='body1' className={classes.productName}>
          {props.name} review
        </Typography>
      </Grid>
      <Grid item xs={12} lg={6}>
        {props.categories.map((category: CategoryItem) => {
          return (
            <Chip
              className={classes.categoryChip}
              key={category.key}
              label={category.label}
              size='small'
            />
          )
        })}
      </Grid>
    </Grid>
  );
}

export default ProductPreview;

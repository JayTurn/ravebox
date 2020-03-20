/**
 * ProductPreview.tsx
 * Preview component of the product details.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { ProductPreviewProps } from './ProductPreview.interface';

/**
 * Renders the product preview component.
 */
const ProductPreview: React.FC<ProductPreviewProps> = (
  props: ProductPreviewProps
) => {
  return (
    <Grid container direction='column'>
      <Grid item xs={12}>
        <Typography variant='h4'>
          {props.name}
        </Typography>
        <Typography variant='body1'>
          Brand: {props.brand}
        </Typography>
        <Typography variant='body1'>
          Category:&nbsp; 
          {props.categories.map((category: CategoryItem, index: number) => {
            return (
              <React.Fragment key={category.key}>
                <span>
                  {category.label}
                </span>
                {index < props.categories.length - 1 &&
                  <span> > </span>
                }
              </React.Fragment>
            )
          })}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ProductPreview;

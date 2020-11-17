/**
 * ProductImages.tsx
 * Product images component.
 */

// Modules.
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import ProductImage from './ProductImage';

// Interfaces.
import { ImageAndTitle } from '../../elements/image/Image.interface';
import { ProductImagesProps } from './ProductImages.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      borderRadius: 10,
      boxShadow: 'none',
      display: 'inline-block',
      width: `100%`,
    },
    cardMedia: {
      paddingTop: '100%'
    },
    container: {
      backgroundColor: theme.palette.background.default,
      //boxShadow: `0px -1px 1px rgba(100,106,240,.15), 0px 1px 3px rgba(100,106,240,.25)`,
      margin: theme.spacing(1, 0, 0)
    },
    gridContainer: {
      padding: theme.spacing(1, 1, 2)
    },
    title: {
      //color: theme.palette.common.white,
      //color: theme.palette.primary.main,
      fontSize: '1.2rem',
      fontWeight: 800,
      margin: theme.spacing(.75, 0, 0),
      textTransform: 'capitalize'
    },
    titleContainer: {
      padding: theme.spacing(.5, 2)
    }
  })
);

/**
 * Renders the product images.
 */
const ProductImages: React.FC<ProductImagesProps> = (props: ProductImagesProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();
  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12} className={clsx(classes.titleContainer)}>
        <Typography variant='body1' className={clsx(classes.title)}>
          Photos
        </Typography>
      </Grid>
      <Grid item xs={12} className={clsx(classes.gridContainer)}>
        <Grid container spacing={1}>
          {props.images.map((productImage: ImageAndTitle) => {
            return (
              <Grid item xs={4} key={productImage.url}>
                <ProductImage image={{...productImage}} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductImages;

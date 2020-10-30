/**
 * ProductImages.tsx
 * Product images component.
 */

// Modules.
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
      display: 'inline-block',
      width: `100%`,
    },
    cardMedia: {
      paddingTop: '100%'
    },
    container: {
      backgroundColor: theme.palette.background.default,
      boxShadow: `0px -1px 1px rgba(100,106,240,.15), 0px 1px 3px rgba(100,106,240,.25)`,
      margin: theme.spacing(1, 0)
    },
    gridContainer: {
      padding: theme.spacing(2, 1)
    },
    title: {
      color: theme.palette.primary.main,
      fontSize: '.85rem',
      fontWeight: 700,
      margin: theme.spacing(.75, 0),
      textTransform: 'uppercase'
    },
    titleContainer: {
      borderBottom: `1px solid rgba(100, 106, 240, .15)`,
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
              <Grid item xs={6}>
                <Card className={clsx(classes.cardContainer)} key={productImage.url}>
                  <CardMedia
                    className={clsx(classes.cardMedia)}
                    image={productImage.url}
                    title={productImage.title}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductImages;

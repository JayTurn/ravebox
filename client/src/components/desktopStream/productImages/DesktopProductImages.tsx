/**
 * DesktopProductImages.tsx
 * Desktop product images component.
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

// Components.
import ProductImage from '../../raveStream/productImages/ProductImage';

// Interfaces.
import { ImageAndTitle } from '../../elements/image/Image.interface';
import { DesktopProductImagesProps } from './DesktopProductImages.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      boxShadow: 'none',
      borderRadius: 10,
      display: 'inline-block',
      width: `100%`,
    },
    cardMedia: {
      paddingTop: '100%'
    },
    container: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1, 2)
    },
    gridContainer: {
      padding: theme.spacing(2, 1)
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: 700,
      margin: theme.spacing(.75, 0),
      textTransform: 'uppercase'
    },
    titleContainer: {
      padding: theme.spacing(.5, 2)
    }
  })
);

/**
 * Renders the product images.
 */
const DesktopProductImages: React.FC<DesktopProductImagesProps> = (props: DesktopProductImagesProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();
  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12} className={clsx(classes.titleContainer)}>
        <Typography variant='body1' className={clsx(classes.title)}>
          Product Photos
        </Typography>
      </Grid>
      <Grid item xs={12} className={clsx(classes.gridContainer)}>
        <Grid container spacing={1}>
          {props.images.map((productImage: ImageAndTitle) => {
            return (
              <Grid item xs={props.xs || 6} md={props.md || 4} lg={props.lg || 3} key={productImage.url}>
                <ProductImage image={productImage} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DesktopProductImages;

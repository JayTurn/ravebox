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
      boxShadow: `0 1px 1px rgba(0,0,0,0.15)`,
      display: 'inline-block',
      margin: theme.spacing(0, .5),
      width: `calc(100vw * .4)`,
      '&:first-child': {
        marginLeft: theme.spacing(1)
      },
      '&:last-child': {
        marginRight: theme.spacing(1)
      }
    },
    cardMedia: {
      paddingTop: '100%'
    },
    scrollableWrapper: {
      overflow: 'hidden',
      padding: theme.spacing(0),
      width: '100%'
    },
    scrollableContainer: {
      overflowX: 'scroll',
      overflowY: 'hidden',
      '&::-webkit-scrollbar': {
        display: 'none'
      },
      whiteSpace: 'nowrap'
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
    <Box className={clsx(classes.scrollableWrapper)}>
      <Box className={clsx(classes.scrollableContainer)}>
        {props.images.map((productImage: ImageAndTitle) => {
          return (
            <Card className={clsx(classes.cardContainer)} key={productImage.url}>
              <CardMedia
                className={clsx(classes.cardMedia)}
                image={productImage.url}
                title={productImage.title}
              />
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProductImages;
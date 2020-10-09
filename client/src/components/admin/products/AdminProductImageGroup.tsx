/**
 * AdminProductImageGroup.tsx
 * Renders the component displaying the group of product images.
 */

// Modules.
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import AdminProductImage from './AdminProductImage';

// Interfaces.
import { AdminProductImageGroupProps } from './AdminProductImageGroup.interface';
import { ImageAndTitle } from '../../elements/image/Image.interface';

/**
 * Create styles for the admin product images component.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
  },
}));

/**
 * Renders the product image group for the admin screen.
 */
const AdminProductImageGroup: React.FC<AdminProductImageGroupProps> = (props: AdminProductImageGroupProps) => {

  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  /**
   * Updates the group of images with the image data provided.
   *
   * @param { ImageAndTitle } image - the image data.
   * @param { number } index - the index of the image to be updated.
   */
  const updateImageDetails: (
    image: ImageAndTitle
  ) => (
    index: number
  ) => void = (
    image: ImageAndTitle
  ) => (
    index: number
  ): void =>{

    // Create a copy of the images and update the data provided.
    const updatedImages: Array<ImageAndTitle> = [...props.images];

    if (updatedImages[index]) {
      updatedImages[index] = {...image};
    }
    props.update(updatedImages);
  }

  /**
   * Removes an image from the image list.
   *
   * @param { number } index - index of the image to be removed.
   */
  const removeImage: (
    index: number
  ) => void = (
    index: number
  ): void => {
    const updatedImages: Array<ImageAndTitle> = [];

    let i: number = 0;

    do {

      if (i === index) {
        i++;
        continue;
      }

      const current: ImageAndTitle = {...props.images[i]};

      updatedImages.push(current);

      i++;

    } while (i < props.images.length);

    props.update(updatedImages);
  }

  /**
   * Updates the image position in the list.
   *
   * @param { number } current - the index of the current image.
   * @param { number } value - the number of positions to move.
   */
  const shiftPosition: (
    current: number
  ) => (
    value: number
  ) => void = (
    current: number
  ) => (
    value: number
  ): void => {

    // Determine the new index position.
    const newIndex: number = current + value,
          shiftedImage: ImageAndTitle = {...props.images[current]};

    // Don't do anything if we're already at the last image.
    if (newIndex >= props.images.length) {
      return;
    }

    // Don't do anything if this is already the first image.
    if (newIndex < 0) {
      return;
    }

    // Create a new array from the existing items.
    let i: number = 0;
    const updatedImages: Array<ImageAndTitle> = [];
    do {
      if (i === current) {
        if (i < props.images.length) {
          i++;
        }
        continue;
      }

      const currentImage: ImageAndTitle = {...props.images[i]};

      if (i === newIndex) {
        if (value > 0) {
          updatedImages.push(currentImage);
          updatedImages.push(shiftedImage);
        } else {
          updatedImages.push(shiftedImage);
          updatedImages.push(currentImage);
        }
      } else {
        updatedImages.push(currentImage);
      }


      i++;

    } while (i < props.images.length);

    props.update(updatedImages);
  }

  return (
    <React.Fragment>
      <Grid container className={clsx(classes.container)} spacing={2}>
        {props.images.map((image: ImageAndTitle, index: number) => {
          return (
            <Grid item key={image.url} xs={6} sm={3} md={2}>
              <AdminProductImage
                image={image}
                index={index} 
                update={updateImageDetails}
                removeImage={removeImage}
                shiftPosition={shiftPosition}
              />
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  )
}

export default AdminProductImageGroup;

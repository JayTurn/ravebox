/**
 * CardVideo.tsx
 * CardVideo menu component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Components.
import CardUser from '../cardUser/CardUser';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { CardVideoProps } from './CardVideo.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    brandText: {
      display: 'block',
      fontSize: '.8rem',
      fontWeight: 600
    },
    buttonElement: {
      fontWeight: 700,
      '&.MuiButton-root': {
        borderRadius: 20,
        boxShadow: `0 1px 4px rgba(0,0,0,0.2)`
      }
    },
    buttonContainer: {
      bottom: 20,
      right: 20,
      position: 'absolute',
      zIndex: 2
    },
    container: {
      borderRadius: 20,
      height: 330,
      overflow: 'hidden',
      position: 'relative',
      width: '100%'
    },
    productContainer: {
      backgroundColor: theme.palette.common.white,
      borderRadius: 5,
      top: 20,
      left: 20,
      padding: theme.spacing(1),
      position: 'absolute',
      zIndex: 2
    },
    productTitle: {
      fontSize: '1.1rem',
      fontWeight: 500
    },
    thumbnailContainer: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      height: '100%',
      left: 0,
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1
    },
    userContainer: {
      bottom: 20,
      left: 20,
      position: 'absolute',
      zIndex: 2
    },
  })
);

/**
 * Renders the rave stream card.
 */
const CardVideo: React.FC<CardVideoProps> = (props: CardVideoProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    active,
    review
  } = {...props};

  return (
    <Box className={clsx(classes.container)}>
      <Box className={clsx(classes.productContainer)}>
        {review.product &&
          <Typography variant='h3' className={clsx(classes.productTitle)}>
            <Box component='span' className={clsx(classes.brandText)}>
              {review.product.brand.name}
            </Box>
            {review.product.name}
          </Typography>
        }
      </Box>
      <Box className={clsx(classes.userContainer)}>
        <CardUser review={{...review}} />
      </Box>
      <Box className={clsx(classes.buttonContainer)}>
        <StyledButton
          className={clsx(classes.buttonElement)}
          clickAction={() => {}}
          color='secondary'
          title='Watch'
        />
      </Box>
      <Box
        className={clsx(classes.thumbnailContainer)}
        style={{backgroundImage: `url(${review.thumbnail})`}}
      >
      </Box>
    </Box>
  );
}

export default CardVideo;

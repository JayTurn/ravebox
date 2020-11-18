/**
 * ProductImage.tsx
 * Product image component.
 */

// Modules.
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Interfaces.
import { ImageAndTitle } from '../../elements/image/Image.interface';
import { ProductImageProps } from './ProductImage.interface';

/**
 * Circular progress spinner.
 */
const StyledBackdrop = withStyles(theme => ({
  root: {
    backgroundColor: `rgba(0,0,0,0.9)`
  },
}))(Backdrop);

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
    cardPaper: {
      backgroundColor: 'transparent',
      margin: theme.spacing(2),
      outline: 0
    },
    cardPaperLarge: {
      maxWidth: '33.33%',
    },
    creditLink: {
      color: 'inherit'
    },
    creditText: {
      color: theme.palette.common.white,
      fontSize: '1rem'
    },
    closeButtonContainer: {
      position: 'absolute',
      top: theme.spacing(2),
      right: theme.spacing(2)
    },
    closeButton: {
      backgroundColor: `rgba(0,0,0,0.2)`,
    },
    closeButtonIcon: {
      color: theme.palette.common.white
    },
    container: {
      backgroundColor: theme.palette.background.default,
      //boxShadow: `0px -1px 1px rgba(100,106,240,.15), 0px 1px 3px rgba(100,106,240,.25)`,
      margin: theme.spacing(1, 0, 0)
    },
    gridContainer: {
      padding: theme.spacing(1, 1, 2)
    },
    modal: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    modalCardContainer: {
      backgroundColor: 'transparent',
      position: 'relative'
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
const ProductImage: React.FC<ProductImageProps> = (props: ProductImageProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Set the open state of the modal.
  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Handles the close event.
   */
  const handleClose: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setOpen(false);
  }

  /**
   * Handles the display for creating a new user.
   */
  const handleOverlay: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setOpen(!open);
  }

  return (
    <React.Fragment>
      <Card 
        className={clsx(classes.cardContainer)}
        raised={false}
      >
        <CardActionArea
          onClick={handleOverlay}
        >
          <CardMedia
            className={clsx(classes.cardMedia)}
            image={props.image.url}
            title={props.image.title}
          />
        </CardActionArea>
      </Card>
      <Modal
        BackdropComponent={StyledBackdrop}
        BackdropProps={{
          timeout: 300
        }}
        className={clsx(classes.modal)}
        closeAfterTransition
        open={open}
        onClose={handleOverlay}
      >
        <Paper className={clsx(
          classes.cardPaper, {
            [classes.cardPaperLarge]: largeScreen
          }
        )}>
          <Card className={clsx(classes.modalCardContainer)}>
            <Box className={clsx(classes.closeButtonContainer)}>
              <IconButton onClick={handleClose} className={clsx(classes.closeButton)}>
                <CloseRoundedIcon className={clsx(classes.closeButtonIcon)}/>
              </IconButton>
            </Box>
            <CardMedia
              component='img'
              image={props.image.url}
              title={props.image.title}
            />
            {props.image.creditText || props.image.creditUrl &&
              <CardContent>
                {props.image.creditUrl ? (
                  <Typography variant='body1' className={clsx(classes.creditText)}>
                    Photo credit: <Link href={props.image.creditUrl} target='_blank' className={clsx(classes.creditLink)}>{props.image.creditText}</Link>
                  </Typography>
                ) : (
                  <Typography variant='body1' className={clsx(classes.creditText)}>
                    Photo credit: {props.image.creditText}
                  </Typography>
                )}
              </CardContent>
            }
          </Card>
        </Paper>
      </Modal>
    </React.Fragment>
  );
};

export default ProductImage;

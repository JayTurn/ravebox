/**
 * AdminProductImage.tsx
 * Renders the component displaying the product image.
 */

// Modules.
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import DeleteForeverRoundedIcon from '@material-ui/icons/DeleteForeverRounded';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import Input from '../../forms/input/Input';
import StyledButton from '../../elements/buttons/StyledButton';

// Interfaces.
import { AdminProductImageProps } from './AdminProductImage.interface';
import { ImageAndTitle } from '../../elements/image/Image.interface';
import { InputData } from '../../forms/input/Input.interface';

/**
 * Create styles for the admin product images component.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  buttonContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    width: '100%'
  },
  buttons: {
    backgroundColor: `rgba(255,255,255, 0.7)`,
    padding: theme.spacing(1)
  },
  cardContainer: {
    position: 'relative'
  },
  container: {
  },
  deleteButton: {
    marginLeft: 'auto'
  },
  editButton: {
    right: theme.spacing(1),
    position: 'absolute',
    top: theme.spacing(1),
    zIndex: 2
  },
  editContainer: {
    maxWidth: 1080,
    outline: 0,
    padding: theme.spacing(2)
  },
  icons: {
    height: '1rem',
    width: '1rem'
  },
  media: {
    height: 0,
    paddingTop: '100%'
  },
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  nextButton: {
    marginLeft: theme.spacing(1)
  },
  textContainer: {
    marginTop: theme.spacing(1)
  },
  verticalMargin: {
  }
}));

/**
 * Renders the product image for the admin screen.
 */
const AdminProductImage: React.FC<AdminProductImageProps> = (props: AdminProductImageProps) => {

  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Set the open state of the modal.
  const [open, setOpen] = React.useState<boolean>(false);

  const [image, setImage] = React.useState<ImageAndTitle>(props.image);

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

  /**
   * Handles moving the position of the image.
   */
  const moveNext: (
  ) => void = (
  ): void => {
    props.shiftPosition(props.index)(1);
  }

  /**
   * Handles moving the position of the image.
   */
  const movePrevious: (
  ) => void = (
  ): void => {
    props.shiftPosition(props.index)(-1);
  }

  /**
   * Handles removing an image.
   */
  const removeImage: (
  ) => void = (
  ): void => {
    props.removeImage(props.index);
  }

  /**
   * Handles updates to the review form field.
   *
   * @param { InputData } data - the field data.
   */
  const updateInputs: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
    setImage({
      ...image,
      [data.key]: data.value
    });
  }

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
   * Handles the submit button event.
   */
  const handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    props.update(image)(props.index);
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Box className={clsx(classes.container)}>
        <Card className={clsx(classes.cardContainer)}>
          <IconButton
            className={clsx(
              classes.editButton,
              classes.buttons
            )}
            onClick={handleOverlay}
          >
            <EditRoundedIcon className={clsx(classes.icons)}/>  
          </IconButton>
          <CardMedia
            className={clsx(classes.media)}
            image={props.image.url}
            title={props.image.title}
          />
          <Box className={clsx(classes.buttonContainer)}>
            <CardActions disableSpacing>
              <IconButton
                className={clsx(
                  classes.buttons
                )}
                title='Move to the previous position'
                onClick={movePrevious}
              >
                <ArrowBackRoundedIcon className={clsx(classes.icons)}/>
              </IconButton>
              <IconButton
                className={clsx(
                  classes.buttons,
                  classes.nextButton
                )}
                title='Move to the next position'
                onClick={moveNext}
              >
                <ArrowForwardRoundedIcon className={clsx(classes.icons)}/>
              </IconButton>
              <IconButton
                className={clsx(
                  classes.buttons,
                  classes.deleteButton
                )}
                title='Delete image'
                onClick={removeImage}
              >
                <DeleteForeverRoundedIcon className={clsx(classes.icons)}/>
              </IconButton>
            </CardActions>
          </Box>
        </Card>
        <Box className={clsx(classes.textContainer)}>
          <Typography variant='body2' color='textSecondary'>
            {props.image.title}
          </Typography>
          {props.image.creditText &&
            <Typography variant='body2' color='textSecondary'>
              <Box component='span'>
                Credit: 
              </Box>
              {props.image.creditUrl ? (
                <Link href={`${props.image.creditUrl}`} target='_blank'>
                  {props.image.creditUrl}
                </Link>
              ) : (
                <Box component='span'>
                </Box>
              )}
            </Typography>
          }
        </Box>
      </Box>
      <Modal
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300
        }}
        className={clsx(classes.modal)}
        closeAfterTransition
        open={open}
        onClose={handleOverlay}
      >
        <Paper className={clsx(classes.editContainer)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h3'>
                Image details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Input
                defaultValue={image.title}
                handleBlur={updateInputs}
                name='title'
                type='text'
                title="Image title"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
                Image credit
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                defaultValue={image.creditText}
                handleBlur={updateInputs}
                name='creditText'
                type='text'
                title="Image owner"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                defaultValue={image.creditUrl}
                handleBlur={updateInputs}
                name='creditUrl'
                type='text'
                title="Image owner credit URL"
              />
            </Grid>
            <Grid item xs={12}>
              <Grid
                container
                justify='space-between'
              >
                <Grid item>
                  <StyledButton
                    title='Cancel'
                    clickAction={handleClose}
                    variant='outlined'
                  />
                </Grid>
                <Grid item>
                  <StyledButton
                    title='Save'
                    clickAction={handleSubmit}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </React.Fragment>
  )
}

export default AdminProductImage;

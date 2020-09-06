/**
 * ImageUpload.tsx
 * Component to upload an image.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import BrowserImageCompression from 'browser-image-compression';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import Cropper from 'react-easy-crop';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Modal from '@material-ui/core/Modal';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { useDropzone } from 'react-dropzone';
import VideocamIcon from '@material-ui/icons/Videocam';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';
import { ImageUploadState } from './ImageUpload.enum';

// Interfaces.
import {
  ImageUploadProps,
  CroppedArea,
  ImageData,
  PresignedImageResponse,
} from './ImageUpload.interface';

// Custom backdrop.
const WhiteBackdrop = withStyles(theme => ({
}))(Backdrop);

// Define the styles to be used for the drop zone.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarIcon: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.grey.A700,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(8),
      width: theme.spacing(8)
    },
    backdrop: {
      backgroundColor: theme.palette.common.white
    },
    buttonContainer: {
      margin: theme.spacing(2, 0)
    },
    cropContainer: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      position: 'relative',
    },
    cropImage: {
      height: '100%',
      left: 0,
      position: 'absolute',
      width: '100%'
    },
    cropControls: {
      width: '100%'
    },
    modal: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      outline: 0
    },
    modalContent: {
      outline: 0
    },
    progressContainer: {
      marginTop: theme.spacing(2),
      width: '100%'
    },
    zone: {
      borderRadius: theme.shape.borderRadius * 2,
      '&:hover': {
        cursor: 'pointer'
      },
    },
    button: {
      backgroundColor: theme.palette.primary.main
    },
    zoneFile: { },
    zoneNoFile: { },
  })
);

/**
 * Creates a random string to cache bust images.
 *
 * @param { string } filename- the name of the file to be randomized.
 *
 * @return string
 */
const randomString:(
  filename: string
) => string = (
  filename: string
): string => {
  // Create a random string to be used for cache busting purposes.
  const random: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Determine the index of the file extention.
  const indexBreak: number = filename.lastIndexOf('.');

  // Capture the name of the file without the file extension.
  const name: string = filename.substring(0, indexBreak);
  // Capture the file extension.
  const extension: string = filename.substring(indexBreak + 1);

  // Return the new file name with the random string.
  return `${name}-${random}.${extension}`;
}

/**
 * Crops the image based on the parameters provided.
 *
 * @param { string } imageSrc - the image url string.
 * @param { CroppedArea } crop - the image cropping data.
 * @param { ImageData } imageData - the image metadata.
 *
 * @return Promise<File>
 */
const cropImage: (
  imageSrc: string
) => (
  crop: CroppedArea
) => (
  imageData: ImageData
) => Promise<File> = (
  imageSrc: string
) => (
  crop: CroppedArea
) => async (
  imageData: ImageData
): Promise<File> => {

  // Load the image element from the image URL string provided.
  return await BrowserImageCompression.loadImage(imageSrc)   
    .then((imageEl: HTMLImageElement) => {

      // Create a new canvas element to be used for the creation of the new
      // image.
      const canvasEl: HTMLCanvasElement = document.createElement('canvas');

      // Set the new canvas element width and height based on the cropping
      // dimensions captured using the crop tool.
      canvasEl.width = crop.width;
      canvasEl.height = crop.height;

      // Convert the canvas to a 2d plane.
      const ctx = canvasEl.getContext('2d');

      // If there was an issue creating the canvas, throw an error.
      if (!ctx) {
        throw new Error(`Couldn't create canvas`);
      }

      // Create a new fill rectangle to hold the image file.
      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

      // Draw the image file onto the canvas using the crop co-ordinates and
      // dimensions.
      ctx.drawImage(
        imageEl,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      // Create a new image file from the canvas.
      return BrowserImageCompression.canvasToFile(
        canvasEl,
        imageData.fileType,
        imageData.fileName,
        imageData.fileLastModified
      );
    })
    .then((imageFile: File | Blob) => {
      // Compress the file using the limits provided.
      return BrowserImageCompression(imageFile, {
        maxSizeMB: imageData.maxFileSize
      });
    })
    .then((imageFile: File | Blob) => {
      // Make sure we return the image as a File rather than a Blob. This is
      // necessary for the upload to work correctly.
      let image: File;
      if (imageFile instanceof Blob) {
        image = new File([imageFile], imageData.fileName, {
          type: imageData.fileType
        }); 
      } else {
        image = imageFile;
      }

      return image;
    });
}

/**
 * Component for handling image uploads.
 */
const ImageUpload: React.FC<ImageUploadProps> = (props: ImageUploadProps) => {
  // Styles for the zone.
  const classes = useStyles();

  // Declare the error states.
  const [errors, setErrors] = React.useState<Array<string>>([]);

  // Define the image src if it exists.
  const [imageSrc, setImageSrc] = React.useState<string>(props.path || '');

  // Declare the image data to be used for image manipulation.
  const [imageData, setImageData] = React.useState<ImageData>({
    fileType: 'image/jpeg',
    fileName: '',
    fileLastModified: 0,
    maxFileSize: props.maxFileSize ? props.maxFileSize : 0.2
  });

  // Declare the upload progress state to be used for notifying a user when
  // an image update is in progress.
  const [uploadProgress, setUploadProgress] = React.useState({
    completion: 0,
    state: ImageUploadState.WAITING
  });

  // Declare the crop dimensions to be used when creating the image
  // within a canvas element.
  const [cropHeight, setCropHeight] = React.useState<number>(0);
  const [cropWidth, setCropWidth] = React.useState<number>(0);

  // Declare the crop and zoom defaults for the cropping tool.
  const [crop, setCrop] = React.useState({ x: 0, y: 0});
  const [zoom, setZoom] = React.useState(1);

  // Define the cropped area to be used when creating a new image.
  const [croppedArea, setCroppedArea] = React.useState<CroppedArea>({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  });

  // Declare the filename to be used to determine if a new image should be
  // loaded.
  const [filename, setFilename] = React.useState<string>('');

  // Define a state to determine if we should show the crop modal.
  const [croppingImage, setCroppingImage] = React.useState<boolean>(false);


  // Retrieve the dropzone properties.
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
    rejectedFiles,
  } = useDropzone({
    accept: 'image/*'
  });

  /**
   * Reads the image file and returns a compressed version for cropping.
   *
   * @param { File } file - the image file to be read.
   *
   * @return Promise<string>
   */
  const readImageFile: (
    file: File
  ) => Promise<string> = async (
    file: File
  ): Promise<string> => {
    // Compress the original file so we are manipulating a smaller sized
    // image. This reduces memory consumption.
    let compressedFile: File | Blob = await BrowserImageCompression(file, {
      maxSizeMB: props.maxFileSize || 0.5,
      maxWidthOrHeight: 1920
    });

    // Declare the image variable to store the image URL.
    let image: string = '';

    // Convert the file into a data url so it can be loaded as an image. This is
    // necessary to read the image updated image dimensions and set the
    // size of the cropping area.
    return BrowserImageCompression.getDataUrlFromFile(compressedFile)
      .then((imageString: string) => {
        image = imageString;
        return BrowserImageCompression.loadImage(imageString);
      })
      .then((imageEl: HTMLImageElement) => {
        // Obtain the original image dimensions. 
        const height: number = imageEl.height,
              width: number = imageEl.width;


        // We want to set the image to a maximum width of 300 pixels. Determine
        // the image resize ratio required to set the maximum image width.
        let ratio: number = 300 / width;
        if (width > 300) {
          ratio = 300 / width;
        } else {
          ratio = width / 300;
        }

        // Update the crop width and height based on the ratio.
        setCropWidth(width * ratio);
        setCropHeight(height * ratio);
        // Set the image data based on the modified image file.
        setImageData({
          ...imageData,
          fileName: randomString(file.name),
          fileLastModified: file.lastModified
        });

        return image;
      });
  }

  /** 
   * Handles accepted file types.
   *
   * @param { File } file - the file to be checked.
   */
  acceptedFiles.map((file: File) => {

    // Remove any errors that might be set.
    if (errors.length > 0) {
      setErrors([]);
    }

    // If the new filename differs to the state of the one we currently have,
    // set the new file name and compress the file ready for cropping.
    if (filename !== file.name) {
      setFilename(file.name);
      readImageFile(file)
        .then((imageString: string) => {
          // Update the image string state to to the newly compressed image.
          setImageSrc(imageString);
          // Display the cropping tool.
          setCroppingImage(true);
        });
    }

    // Blur the current input ref.
    if (inputRef.current) {
      inputRef.current.blur();
    }
  })

  /**
   * Handle rejected file types.
   *
   * @param { File } file - the rejected file.
   */
  rejectedFiles.map((file: File) => {
    if (errors.length <= 0) {
      setErrors([`"${file.name}" is not an accepted image file`]);
    }
  });

  /**
   * Handles closing the modal.
   */
  const handleClose: (
  ) => void = (
  ): void => {
    // Close the cropping tool.
    setCroppingImage(false);
    // Reset the image upload progress.
    setUploadProgress({
      state: ImageUploadState.WAITING,
      completion: 0
    });
  }

  /**
   * Updates the crop position.
   *
   * @param { CroppedArea } - the cropped area dimensions.
   * @param { CroppedPixels } - the cropped area pixels.
   */
  const updateCrop: (
    cropArea: CroppedArea,
    cropAreaPixels: CroppedArea
  ) => void = (
    cropArea: CroppedArea,
    cropAreaPixels: CroppedArea
  ): void => {
    // Update the co-ordinates for the crop area pixels.
    setCroppedArea(cropAreaPixels);
  }

  /**
   * Saves the cropped image and uploads it using a presigned request.
   */
  const saveCroppedImage: (
  ) => void = async (
  ): Promise<void> => {

    // Update the upload progess state so users are aware the upload is
    // happening.
    setUploadProgress({
      state: ImageUploadState.SUBMITTED,
      completion: 0
    });

    // Create a new image file using the information we've created with the
    // cropping tool.
    let imageFile: File = await cropImage(imageSrc)(croppedArea)(imageData);

    // If the image crop failed, return an error.
    if (!imageFile) {

      setUploadProgress({
        state: ImageUploadState.WAITING,
        completion: 0
      });

      // Show an error message.
      setErrors(['Image upload failed. Please try again.']);

      return;
    }

    // Request a presigned URL from the API to be used for uploading the image.
    API.requestAPI<PresignedImageResponse>(props.requestPath, {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        imageTitle: imageFile.name,
        imageSize: imageFile.size,
        imageType: imageFile.type,
        id: props.id
      })
    })
    .then((response: PresignedImageResponse) => {
      // Create the form data to be sent with the XHR POST request.
      const data: FormData = new FormData();
      // Create the new XML HTTP request object.
      const request: XMLHttpRequest = new XMLHttpRequest();

      // Add each field from the preseigned request to the form data. These
      // are required to authorize the image upload.
      Object.keys(response.presigned.fields).forEach((key: string) => {
        data.append(key, response.presigned.fields[key]);
      });

      // Attach the file to the form data.
      data.append('file', imageFile);

      // Handles progress updates during the image upload.
      request.upload.addEventListener('progress', (e: ProgressEvent) => {
        // Calculate the progress percentage.
        let progress: number = (e.loaded / e.total) * 100;

        // If the loaded event is present, update the progress.
        if (e.loaded) {
          setUploadProgress({
            state: ImageUploadState.SUBMITTED,
            completion: progress
          });
        }
      });

      // Handles the completion event for the image upload.
      request.upload.addEventListener('load', (e: ProgressEvent) => {

        // Close the image cropping modal.
        handleClose();

        // Update the profile with the newly cropped image.
        props.update(response.path);

        // Reset the image upload state.
        setUploadProgress({
          completion: 0,
          state: ImageUploadState.WAITING,
        });

      });

      // Handle errors encountered during the image upload.
      request.upload.addEventListener('error', (e: Event) => {
        // Reset the image upload state.
        setUploadProgress({
          ...uploadProgress,
          state: ImageUploadState.WAITING
        });

        // Show an error message.
        setErrors(['Image upload failed. Please try again.']);
      });

      // Open the XHR request for the image upload. 
      request.open('POST', response.presigned.url);

      // Trigger the image upload.
      request.send(data);
    })
    .catch((error: Error) =>{
      // Show an error message.
      setErrors(['Image upload failed. Please try again.']);
    });
  }

  return (
    <Grid
      container
      direction='column'
    >
      {croppingImage ? (
        <Modal
          className={clsx(classes.modal)}
          disableBackdropClick={true}
          open={croppingImage}
          onClose={handleClose}
          BackdropComponent={Backdrop}
          BackdropProps={{
            classes: {
              root: classes.backdrop
            }
          }}
        >
          <Box className={clsx(classes.modalContent)}>
            <Box
              className={clsx(classes.cropContainer)}
              style={{width: cropWidth, height: cropHeight}}
            >
              <Box className={clsx(classes.cropImage)}>
                <Cropper
                  aspect={props.aspectRatio ? props.aspectRatio : 1}
                  image={imageSrc}
                  crop={crop}
                  cropShape={props.circleCrop ? 'round' : 'rect'}
                  onCropChange={setCrop}
                  onCropComplete={updateCrop}
                  onZoomChange={setZoom}
                  zoom={zoom}
                />
              </Box>
            </Box>
            {uploadProgress.state === ImageUploadState.SUBMITTED ? (
              <Grid container>
                <Grid
                  item
                  className={clsx(classes.progressContainer)}
                >
                  <LinearProgress color='primary' />
                </Grid>
              </Grid>
            ) : (
              <Grid
                container
                className={clsx(classes.buttonContainer)}
                justify='space-between'
              >
                <Grid item>
                  <StyledButton
                    clickAction={handleClose}
                    title={`Cancel`}
                    variant='outlined'
                  />
                </Grid>
                <Grid item>
                  <StyledButton
                    clickAction={saveCroppedImage}
                    title={`Save`}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </Modal>
      ): (
        <Grid item xs={12} {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <Button
            color='primary'
            size='large'
          >
            {props.buttonTitle}
          </Button>
        </Grid>
      )}
      {errors.length > 0 &&
        <Grid item xs={12}>
          <Typography variant='subtitle1' color='error' style={{marginTop: '1rem'}}>
            {errors[0]}
          </Typography>
        </Grid>
      }
    </Grid>
  )
};

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: ImageUploadProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStatetoProps,
)(ImageUpload);

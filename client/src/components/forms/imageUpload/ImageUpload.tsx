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
 */
const randomString:(
  filename: string
) => string = (
  filename: string
): string => {
  const random: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const indexBreak: number = filename.lastIndexOf('.');

  const name: string = filename.substring(0, indexBreak);
  const extension: string = filename.substring(indexBreak + 1);

  return `${name}-${random}.${extension}`;
}

/**
 * Crops the image based on the parameters provided.
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

  let imageBlob: Blob;

  return await BrowserImageCompression.loadImage(imageSrc)   
    .then((imageEl: HTMLImageElement) => {
      const canvasEl: HTMLCanvasElement = document.createElement('canvas');

      canvasEl.width = crop.width;
      canvasEl.height = crop.height;

      const ctx = canvasEl.getContext('2d');

      if (!ctx) {
        throw new Error(`Couldn't create canvas`);
      }

      ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);

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

      return BrowserImageCompression.canvasToFile(
        canvasEl,
        imageData.fileType,
        imageData.fileName,
        imageData.fileLastModified
      );
    })
    .then((imageFile: File | Blob) => {
      return BrowserImageCompression(imageFile, {
        maxSizeMB: imageData.maxFileSize
      });
    })
    .then((imageFile: File | Blob) => {
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

  const [errors, setErrors] = React.useState<Array<string>>([]);

  const [imageSrc, setImageSrc] = React.useState<string>(props.path || '');

  const [imageData, setImageData] = React.useState<ImageData>({
    fileType: 'image/jpeg',
    fileName: '',
    fileLastModified: 0,
    maxFileSize: props.maxFileSize ? props.maxFileSize : 0.2
  });

  const [uploadProgress, setUploadProgress] = React.useState({
    completion: 0,
    state: ImageUploadState.WAITING
  });

  const [cropHeight, setCropHeight] = React.useState<number>(0);
  const [cropWidth, setCropWidth] = React.useState<number>(0);

  const [crop, setCrop] = React.useState({ x: 0, y: 0});
  const [zoom, setZoom] = React.useState(1);

  const [croppedArea, setCroppedArea] = React.useState<CroppedArea>({
    width: 0,
    height: 0,
    x: 0,
    y: 0
  });

  const [filename, setFilename] = React.useState<string>('');

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
   * Reads the image file.
   */
  const readImageFile: (
    file: File
  ) => Promise<string> = async (
    file: File
  ): Promise<string> => {
    let compressedFile: File | Blob = await BrowserImageCompression(file, {
      maxSizeMB: props.maxFileSize || 0.5,
      maxWidthOrHeight: 1920
    });

    let image: string = '';

    return BrowserImageCompression.getDataUrlFromFile(compressedFile)
      .then((imageString: string) => {
        image = imageString;
        return BrowserImageCompression.loadImage(imageString);
      })
      .then((imageEl: HTMLImageElement) => {
        const height: number = imageEl.height,
              width: number = imageEl.width;

        const portrait: boolean = height > width;

        let ratio: number = 300 / width;

        if (width > 300) {
          ratio = 300 / width;
        } else {
          ratio = width / 300;
        }

        setCropWidth(width * ratio);
        setCropHeight(height * ratio);
        setImageData({
          ...imageData,
          fileName: randomString(file.name),
          fileLastModified: file.lastModified
        });

        return image;
      });
  }

  // Handle accepted file types.
  acceptedFiles.map((file: File) => {

    if (errors.length > 0) {
      setErrors([]);
    }

    if (filename !== file.name) {
      setFilename(file.name);
      readImageFile(file)
        .then((imageString: string) => {
          setImageSrc(imageString);
          setCroppingImage(true);
        });
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  })

  // Handle rejected file types.
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
    setCroppingImage(false);
    setUploadProgress({
      state: ImageUploadState.WAITING,
      completion: 0
    });
  }

  /**
   * Updates the crop position.
   */
  const updateCrop: (
    cropArea: CroppedArea,
    cropAreaPixels: CroppedArea
  ) => void = (
    cropArea: CroppedArea,
    cropAreaPixels: CroppedArea
  ): void => {
    setCroppedArea(cropAreaPixels);
  }

  /**
   * Handles updates to the image provided.
   *
   * @param { File } uploadImage - the image to be uploaded.
   */
  const saveCroppedImage: (
  ) => void = async (
  ): Promise<void> => {

    // Set the upload state on the image.
    setUploadProgress({
      state: ImageUploadState.SUBMITTED,
      completion: 0
    });

    let imageFile: File = await cropImage(imageSrc)(croppedArea)(imageData);

    if (!imageFile) {
      return;
    }

    // Perform the api request using the image file name.
    API.requestAPI<PresignedImageResponse>(props.requestPath, {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        imageTitle: imageFile.name,
        imageSize: imageFile.size,
        imageType: imageFile.type
      })
    })
    .then((response: PresignedImageResponse) => {
      const data: FormData = new FormData();
      const request: XMLHttpRequest = new XMLHttpRequest();

      Object.keys(response.presigned.fields).forEach((key: string) => {
        data.append(key, response.presigned.fields[key]);
      });

      data.append('file', imageFile);

      request.upload.addEventListener('progress', (e: ProgressEvent) => {
        let progress: number = (e.loaded / e.total) * 100;

        if (e.loaded) {
          console.log(`Progress: ${progress}`);
          setUploadProgress({
            state: ImageUploadState.SUBMITTED,
            completion: progress
          });
          // Set the submission state.
          //setSubmitting(false)
        }
      });

      // Add an event listener for the upload completion.
      request.upload.addEventListener('load', (e: ProgressEvent) => {
          console.log(`Load: ${e}`);
        /*
          uploadMetadata(filename)(response.review._id);
        */

        // Close the image cropping.
        handleClose();

        // Update the profile with the newly cropped image.
        props.update(response.path);

        setUploadProgress({
          completion: 0,
          state: ImageUploadState.WAITING,
        });

      });

      // Add an event listener for the upload error.
      request.upload.addEventListener('error', (e: Event) => {
          console.log(`Error: ${e}`);
        setUploadProgress({
          ...uploadProgress,
          state: ImageUploadState.WAITING
        });
        /*
        setFormErrorMessages(['Video upload failed']);
        // Set the submission state.
        setSubmitting(false)
        */
      });

      request.open('POST', response.presigned.url);

      request.send(data);
    })
    .catch((error: Error) =>{
      console.log(error);
      // Set the submission state.
      //setFormErrorMessages(['Video upload failed']);
    })
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
                  aspect={1}
                  image={imageSrc}
                  crop={crop}
                  cropShape='round'
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
    //profile,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStatetoProps,
  //mapDispatchToProps
)(ImageUpload);

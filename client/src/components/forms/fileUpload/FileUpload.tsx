/**
 * FileUpload.tsx
 * Component to provide file upload functionality.
 */

// Modules.
import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { useDropzone } from 'react-dropzone';
import VideocamIcon from '@material-ui/icons/Videocam';

// Interfaces.
import { FileUploadProps } from './FileUpload.interface';

// Define the styles to be used for the drop zone.
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      borderRadius: theme.shape.borderRadius * 8,
      margin: '0 auto',
      textAlign: 'center',
      width: 200
    },
    changeContainer: {
      backgroundColor: theme.palette.primary.main,
    },
    changeText: {
      color: theme.palette.common.white
    },
    fileIcon: {
      fontSize: '6rem'
    },
    fileName: {
      fontSize: '1.5rem',
      marginBottom: '2rem'
    },
    zone: {
      height: 300,
      borderRadius: theme.shape.borderRadius * 2,
      '&:hover': {
        cursor: 'pointer'
      }
    },
    buttonText: {
      lineHeight: '4rem',
      textTransform: 'uppercase'
    },
    uploadContainer: {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`
    },
    uploadText: {
      color: theme.palette.primary.main
    },
    zoneFile: {
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 2px inset ${theme.palette.primary.light}`
    },
    zoneNoFile: {
      backgroundColor: theme.palette.primary.light,
      boxShadow: `0 0 0 2px inset ${theme.palette.primary.main}`,
      '&:hover': {
        backgroundColor: theme.palette.primary.main
      }
    },
  })
);

/**
 * File upload component for handling form field upload.
 */
const FileUpload: React.FC<FileUploadProps> = (props: FileUploadProps) => {
  // Styles for the zone.
  const classes = useStyles();

  const [errors, setErrors] = React.useState<Array<string>>([]);  

  // Retrieve the dropzone properties.
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
    rejectedFiles,
  } = useDropzone({
    accept: 'video/*'
  });

  // Handle accepted file types.
  acceptedFiles.map((file: File) => {

    if (errors.length > 0) {
      setErrors([]);
    }

    if (props.filename !== file.name) {
      props.update(file);
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }
  })

  // Handle rejected file types.
  rejectedFiles.map((file: File) => {
    if (errors.length <= 0) {
      setErrors([`"${file.name}" is not an accepted video file`]);
    }
  });

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        {props.filename ? (
          <Fade in={props.filename !== ''} timeout={300}>
            <Grid 
              alignItems='center'
              className={clsx(classes.zone, classes.zoneFile)}
              container 
              direction='row'
              alignContent='center'
            >
              <Grid item xs={12} style={{textAlign: 'center', height: '5rem'}}>
                <VideocamIcon color='primary' className={classes.fileIcon}/>
              </Grid>
              <Grid item xs={12} style={{textAlign: 'center'}}>
                <Typography
                  variant='body1'
                  color='primary'
                  className={classes.fileName}
                >
                  {props.filename}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box className={clsx(classes.container, classes.changeContainer)}>
                  <Typography
                    variant='body1'
                    className={clsx(
                      classes.buttonText,
                      classes.changeText
                    )}
                  >
                    Change
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        ) : (
          <Fade in={props.filename === ''} timeout={300}>
            <Grid 
              alignItems='center'
              className={clsx(classes.zone, classes.zoneNoFile)}
              container 
              direction='row'
            >
              <Grid item xs={12}>
                <Box className={clsx(classes.container, classes.uploadContainer)}>
                  <Typography
                    variant='body1'
                    className={clsx(
                      classes.buttonText,
                      classes.uploadText
                    )}
                  >
                    Upload
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Fade>
        )}
      </Grid>
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

export default FileUpload;

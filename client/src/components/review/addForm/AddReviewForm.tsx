/**
 * AddReviewForm.tsx
 * AddReviewForm component to add a new review.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  createStyles,
  makeStyles,
  withStyles,
  useTheme,
  Theme
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import Input from '../../forms/input/Input';
import FileUpload from '../../forms/fileUpload/FileUpload';
import Recommendation from '../recommendation/Recommendation';
import StyledButton from '../../elements/buttons/StyledButton';
import PaddedDivider from '../../elements/dividers/PaddedDivider';

// Enumerators.
import {
  RequestType
} from '../../../utils/api/Api.enum';
import { Recommended } from '../recommendation/Recommendation.enum';
import { FileUploadState } from '../../forms/fileUpload/FileUpload.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { FileUploadStatus } from '../../forms/fileUpload/FileUpload.interface';
import { InputData } from '../../forms/input/Input.interface';
import {
  AddReviewFormResponse, 
  AddReviewFormProps,
  AddReviewMetadataResponse
} from './AddReviewForm.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  allowedCharacters,
  handleAvailable,
  isEmail,
  isPassword,
  isRequired,
  minLength
} from '../../forms/validation/ValidationRules';

/**
 * Styles for the wrapping button element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  progressNumber: {
    border: `2px solid ${theme.palette.primary.dark}`,
    borderRadius: 50,
    boxShadow: `0 0 0 5px #C4C8F5`,
    color: theme.palette.primary.dark,
    display: 'inline-block',
    fontSize: '1.25rem',
    fontWeight: 700,
    height: '70px',
    lineHeight: '70px',
    textAlign: 'center',
    width: '70px'
  },
  mobilePadding: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

/**
 * AddReview validation schema.
 */
const addReviewValidation: ValidationSchema = {
  title: {
    errorMessage: '',
    rules: [
      isRequired
    ]
  }
};

/**
 * Add review form component.
 */
const AddReviewForm: React.FC<AddReviewFormProps> = (props: AddReviewFormProps) => {
  const classes = useStyles(),
        theme = useTheme(),
        mobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Define the review details.
  const [review, setReview] = React.useState({
    title: '',
    recommended: Recommended.RECOMMENDED,
    product: props.productId,
  });

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  const [video, setVideo] = React.useState(new File([''], ''));

  const [uploadProgress, setUploadProgress] = React.useState({
    completion: 0,  
    state: FileUploadState.WAITING
  });

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: addReviewValidation
  });

  /**
   * Updates the review form with previously saved data.
   */
  React.useEffect(() => {
    if (!review.title && props.review) {
      setReview({
        ...review,
        title: props.review.title,
        recommended: props.review.recommended
      });
    }
  }, [props.review]);

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
    setReview({
      ...review,
      [data.key]: data.value
    });
  }

  /**
   * Handles updates to the recommendation field.
   *
   * @param { Recommended } recommended - the recommendation choice.
   */
  const updateRecommendation: (
    recommended: Recommended
  ) => void = (
    recommended: Recommended
  ): void => {
    setReview({
      ...review,
      recommended: recommended
    });
  }

  /**
   * Handles updates to video provided.
   *
   * @param { File } uploadFile - the file to be uploaded.
   */
  const updateVideo: (
    uploadFile: File
  ) => void = (
    uploadFile: File
  ): void => {
    setVideo(uploadFile);
  }

  /**
   * Handles the updating of the metadata file to trigger the video processing.
   */
  const uploadMetadata: (
    filename: string
  ) => (
    reviewId: string
  ) => void = (
    filename: string
  ) => (
    reviewId: string
  ): void => {
    // Perform the api request using the video file name.
    API.requestAPI<AddReviewMetadataResponse>('review/metadata', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        reviewId: reviewId,
        videoTitle: filename
      })
    })
    .then((response: AddReviewMetadataResponse) => {
      setUploadProgress({
        completion: 100,
        state: FileUploadState.COMPLETE
      });
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

  /**
   * Submits the review for creation.
   */
  const submit: (
  ) => Promise<void> = async (
  ): Promise<void> => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields({
      'title': review.title
    });

    // If we have any errors, set the messages on the form and prevent the
    // submission.
    if (errors.length > 0) {
      setFormErrorMessages(errors);
      setSubmitting(false)
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    props.toggleProduct(false);

    //uploadMetadata('testfile.mov')('5e7dfa55c6a4250061e39571');
    // Define the filename.
    const filename: string = video.name.split(' ').join('-').toLowerCase();

    API.requestAPI<AddReviewFormResponse>('review/create', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        ...review,
        videoTitle: filename,
        videoSize: video.size,
        videoType: video.type
      })
    })
    .then((response: AddReviewFormResponse) => {
      const data: FormData = new FormData();
      const request: XMLHttpRequest = new XMLHttpRequest();

      Object.keys(response.presigned.fields).forEach((key: string) => {
        data.append(key, response.presigned.fields[key]);
      })

      data.append('file', video);

      // Add an event listener for the upload progress.
      request.upload.addEventListener('progress', (e: ProgressEvent) => {
        if (e.loaded) {
          setUploadProgress({
            state: FileUploadState.SUBMITTED,
            completion: (e.loaded / e.total) * 100}
          );
          // Set the submission state.
          setSubmitting(false)
        }
      });

      // Add an event listener for the upload completion.
      request.upload.addEventListener('load', (e: ProgressEvent) => {
        uploadMetadata(filename)(response.review._id);
      });

      // Add an event listener for the upload error.
      request.upload.addEventListener('error', (e: Event) => {
        setUploadProgress({
          ...uploadProgress,
          state: FileUploadState.WAITING
        });
        setFormErrorMessages(['Video upload failed']);
        // Set the submission state.
        setSubmitting(false)
      });

      request.open('POST', response.presigned.url);

      request.send(data);

    })
    .catch((error: Error) => {
      setFormErrorMessages(['Video upload failed']);
      // Set the submission state.
      setSubmitting(false)
    });
  };

  /**
   * Displays the add review form prompt.
   * @method render
   *
   * @return React.ReactNode
   */
  return (
    <Grid
      container
      direction='column'
      className={clsx({
        [classes.mobilePadding]: mobile
      })}
    >
      {uploadProgress.state === FileUploadState.WAITING &&
        <Fade in={uploadProgress.state === FileUploadState.WAITING} timeout={300}>
          <React.Fragment>
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Typography variant='h3'>
                Add a title for your review
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Input
                handleBlur={updateInputs}
                name='title'
                required={true}
                type='text'
                title="Title"
              />
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '1rem', marginTop: '1rem'}}>
              <Typography variant='h3' style={{}}>
                Product recommendation
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '1rem'}}>
              <Typography variant='subtitle1' gutterBottom>
                At ravebox, we're all about honest reviews that get straight to the point. That's why rave's are limited to 2 minutes and we encourage you to review products you love <Box component='span' style={{fontWeight: 700}}>and</Box> one's you don't.
              </Typography>
            </Grid>
            <Recommendation 
              update={updateRecommendation} 
              recommended={review.recommended}
            />
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Typography variant='h3'>
                Review video
              </Typography>
              <List>
                <ListItem>
                  Videos must be less than 2 minutes in length
                </ListItem>
                <ListItem>
                  Videos containing nudity or profanity will be removed
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '2rem'}}>
              <FileUpload name='videoFile' update={updateVideo} filename={video.name}/>
            </Grid>
            <Grid item xs={12}>
              <StyledButton
                clickAction={submit}
                color='secondary'
                disabled={submitting}
                size='large'
                submitting={submitting}
                title='Submit'
              />
            </Grid>
          </React.Fragment>
        </Fade>
      }
      {uploadProgress.state === FileUploadState.SUBMITTED &&
        <Fade in={uploadProgress.state === FileUploadState.SUBMITTED} timeout={300}>
          <Grid item xs={12} lg={6}>
            <Typography variant='h2' color='primary' style={{marginBottom: '2rem'}}>We're uploading your rave video</Typography>
            <Typography variant='body1' style={{marginBottom: '2rem'}}>
              <Box component='p'>
                Hang tight, please don't close the ravebox window whilst we upload your new video. If you close this window the upload will fail and penguins will perish. Nobody wants that.
              </Box>
            </Typography>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={9}>
                <LinearProgress variant='determinate' color='primary' value={uploadProgress.completion} />
              </Grid>
              <Grid item xs={3}>
                <Typography variant='h4' className={classes.progressNumber}>
                  {Math.ceil(uploadProgress.completion)}%
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      }
      {uploadProgress.state === FileUploadState.COMPLETE &&
        <Fade in={uploadProgress.state === FileUploadState.COMPLETE} timeout={300}>
          <Grid item xs={12} lg={12}>
            <Typography variant='h2' color='primary' style={{marginBottom: '2rem'}}>Upload successful</Typography>
            <Typography variant='body1' gutterBottom>
              <Box component='p'>
                Great news, we've sucessfully uploaded your new rave video!
              </Box>
              <Box component='p'>
                We need to review your video before it goes live but rest assured, we'll notify you as soon as it is live.
              </Box>
            </Typography>
            <Grid container direction='row' alignItems='center'>
              <Grid item xs={9}>
                <LinearProgress variant='determinate' color='primary' value={uploadProgress.completion} />
              </Grid>
              <Grid item xs={3}>
                <Typography variant='h4' className={classes.progressNumber}>
                  {Math.ceil(uploadProgress.completion)}%
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      }
    </Grid>
  );
}

/**
 * Map dispatch actions to the add review form component.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    { },
    dispatch
  );

/**
 * Maps the redux store properties to the review form component.
 */
const mapStatetoProps = (state: any, ownProps: AddReviewFormProps): AddReviewFormProps => {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(AddReviewForm));

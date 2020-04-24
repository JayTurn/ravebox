/**
 * EditReviewForm.tsx
 * EditReviewForm component to add a new review.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Typography from '@material-ui/core/Typography';
import { VariantType, useSnackbar } from 'notistack';

// Components.
import Input from '../../forms/input/Input';
import FileUpload from '../../forms/fileUpload/FileUpload';
import RaveVideo from '../../raveVideo/RaveVideo';
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
  EditReviewFormRequest,
  EditReviewFormResponse, 
  EditReviewFormProps,
  ReviewMetadataResponse
} from './EditReviewForm.interface';
import { Review } from '../Review.interface';
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
  }
}));

/**
 * Review validation schema.
 */
const reviewValidation: ValidationSchema = {
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
const EditReviewForm: React.FC<EditReviewFormProps> = (props: EditReviewFormProps) => {
  const classes = useStyles(),
        theme = useTheme();
  // Register the snackbar for success updates.
  const { enqueueSnackbar } = useSnackbar();

  // Define the review details.
  const [review, setReview] = React.useState<Review>(props.review ? props.review : {
    created: new Date(),
    _id: '',
    title: '',
    recommended: Recommended.RECOMMENDED,
    url: ''
  });

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  const [video, setVideo] = React.useState<File>(new File([''], ''));

  const [changeVideo, setChangeVideo] = React.useState<boolean>(false);

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
    validation: reviewValidation
  });

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
   * Switches the video editing state.
   *
   * @param { boolean } state - the video editing state.
   */
  const editVideo: (
    state: boolean
  ) => void = (
    state: boolean
  ): void => {
    setChangeVideo(state);
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
    API.requestAPI<ReviewMetadataResponse>('review/metadata', {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.POST,
      body: JSON.stringify({
        reviewId: reviewId,
        videoTitle: filename
      })
    })
    .then((response: ReviewMetadataResponse) => {
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
   * Submits the edited review.
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

    // Hide the product if it's currently displaying.
    props.toggleProduct(false);

    // Define the request object to be sent for updating.
    let editedReview: EditReviewFormRequest = {
      _id: review._id,
      title: review.title,
      recommended: review.recommended
    };

    if (video.name) {
      // Define the filename.
      const filename: string = video.name.split(' ').join('-').toLowerCase();

      editedReview.videoTitle = filename;
      editedReview.videoSize = video.size;
      editedReview.videoType = video.type;
    }

    // Perform the request to update the review.
    API.requestAPI<EditReviewFormResponse>(`review/edit/${editedReview._id}`, {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.PATCH,
      body: JSON.stringify({
        ...editedReview
      })
    })
    .then((response: EditReviewFormResponse) => {

      // If we didn't submit a new video file, display the success snackbar
      // message and prevent additional handling.
      if (!editedReview.videoTitle) {
        setSubmitting(false);
        enqueueSnackbar('Rave updated successfully', { variant: 'success' });
        return;
      }

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
        uploadMetadata(editedReview.videoTitle || '')(response.review._id);
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
    >
      {uploadProgress.state === FileUploadState.WAITING &&
        <Fade in={uploadProgress.state === FileUploadState.WAITING} timeout={300}>
          <React.Fragment>
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Typography variant='h3'>
                Update your title
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Input
                defaultValue={review.title}
                handleBlur={updateInputs}
                name='title'
                required={true}
                type='text'
                title="Title"
              />
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
            {changeVideo || !review.videoURL ? (
              <React.Fragment>
                <Grid item xs={12} lg={6} style={{marginBottom: review.videoURL ? '0' : '3rem'}}>
                  <FileUpload name='videoFile' update={updateVideo} filename={video.name}/>
                </Grid>
                { review.videoURL &&
                  <Grid item xs={12} lg={6} style={{marginTop: '1rem', marginBottom: '3rem'}}>
                    <StyledButton
                      clickAction={() => editVideo(false)}
                      color='primary'
                      size='large'
                      title={'Cancel'}
                    />
                  </Grid>
                }
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
                  <RaveVideo url={review.videoURL} />
                </Grid>
                <Grid item xs={12} lg={6} style={{marginBottom: '3rem'}}>
                  <StyledButton
                    clickAction={() => editVideo(true)}
                    color='primary'
                    size='large'
                    title={review.videoURL ? 'Upload new' : 'Upload'}
                  />
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <StyledButton
                clickAction={submit}
                color='secondary'
                disabled={submitting}
                size='large'
                submitting={submitting}
                title='Update Rave'
              />
            </Grid>
          </React.Fragment>
        </Fade>
      }
      {uploadProgress.state === FileUploadState.SUBMITTED &&
        <Fade in={uploadProgress.state === FileUploadState.SUBMITTED} timeout={300}>
          <Grid item xs={12} lg={6}>
            <Typography variant='h2' color='primary' style={{marginBottom: '2rem'}}>We're uploading your rave</Typography>
            <Typography variant='body1' style={{marginBottom: '2rem'}}>
              <Box component='p'>
                Thanks for posting your rave!
              </Box>
              <Box component='p'>
              Hang tight, please don't close the ravebox window whilst we upload your video. If you close this window the upload will fail and penguins will perish. Nobody wants that.
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
                Great news, we've sucessfully uploaded your rave!
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
const mapStatetoProps = (state: any, ownProps: EditReviewFormProps): EditReviewFormProps => {
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
)(EditReviewForm));

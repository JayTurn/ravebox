/**
 * EditReviewForm.tsx
 * EditReviewForm component to add a new review.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
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
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { VariantType, useSnackbar } from 'notistack';

// Components.
import Input from '../../forms/input/Input';
import FileUpload from '../../forms/fileUpload/FileUpload';
import ImageUpload from '../../forms/imageUpload/ImageUpload';
import RaveVideo from '../../raveVideo/RaveVideo';
import Recommendation from '../recommendation/Recommendation';
import AddReviewLink from '../addReviewLink/AddReviewLink';
import Sponsored from '../sponsored/Sponsored';
import StyledButton from '../../elements/buttons/StyledButton';
import PaddedDivider from '../../elements/dividers/PaddedDivider';

// Enumerators.
import { FileUploadState } from '../../forms/fileUpload/FileUpload.enum';
import { ImageUploadPaths } from '../../forms/imageUpload/ImageUpload.enum';
import { Recommended } from '../recommendation/Recommendation.enum';
import {
  RequestType
} from '../../../utils/api/Api.enum';
import { Role } from '../../user/User.enum';
import { VideoType } from '../Review.enum';

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
import { PrivateProfile } from '../../user/User.interface';
import {
  Review,
  ReviewLink
} from '../Review.interface';
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
  padding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  poster: {
    maxWidth: '100%'
  },
  posterWrapper: {
    maxWidth: 400
  },
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
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Set the youtube flag if this account should be working with YouTube videos.
  const [youTubeAccount, setYouTubeAccount] = React.useState<boolean>(
    props.profile && props.profile.role.includes(Role.YOUTUBE) ? true : false
  );

  // Register the snackbar for success updates.
  const { enqueueSnackbar } = useSnackbar();

  // Define the review details.
  const [review, setReview] = React.useState<Review>(props.review ? props.review : {
    created: new Date(),
    description: '',
    endTime: 0,
    links: [{
      code: '',
      info: '',
      path: ''
    }],
    _id: '',
    sponsored: false,
    startTime: 0,
    thumbnail: '',
    title: '',
    recommended: Recommended.RECOMMENDED,
    url: '',
    videoType: VideoType.NATIVE,
    videoURL: ''
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

  // Declares the poster update status.
  const [updatingPoster, setUpdatingPoster] = React.useState<boolean>(false);

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
   * Handles updates to the review links.
   *
   * @param { ReviewLink } reviewLink - the review link provided.
   * @param { number } index - the link index to be updated.
   */
  const updateReviewLinks: (
    reviewLink: ReviewLink
  ) => (
    index: number
  ) => void = (
    reviewLink: ReviewLink
  ) => (
    index: number
  ): void => {
    const current: Review = { ...review };

    // If we have an index for the current link, update the values.
    if (current.links[index]) {
      current.links[index] = {...reviewLink};
    }

    setReview({
      ...current,
    });
  }

  /**
   * Handles updates to the sponsored content field.
   *
   * @param { boolean } sponsored - the sponsorship choice.
   */
  const updatedSponsorship: (
    sponsored: boolean
  ) => void = (
    sponsored: boolean
  ): void => {
    setReview({
      ...review,
      sponsored: sponsored
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
   * Updates the poster image and submits the updated review.
   *
   * @param { string } path - the path to the poster image.
   */
  const updatePoster: (
    path: string
  ) => void = (
    path: string
  ): void => {

    setUpdatingPoster(true);

    submit(path);

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
   * Handles the submit button functionality.
   */
  const handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    submit();
  }

  /**
   * Submits the edited review.
   */
  const submit: (
    updatedPoster?: string
  ) => Promise<void> = async (
    updatedPoster?: string
  ): Promise<void> => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    if (!updatedPoster) {
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
    }

    // Hide the product if it's currently displaying.
    props.toggleProduct(false);

    // Define the request object to be sent for updating.
    let editedReview: EditReviewFormRequest = {
      description: review.description || '',
      endTime: review.endTime,
      links: review.links,
      _id: review._id,
      sponsored: review.sponsored,
      startTime: review.startTime,
      thumbnail: updatedPoster ? updatedPoster : review.thumbnail,
      title: review.title,
      recommended: review.recommended,
      videoType: review.videoType || VideoType.NATIVE
    };

    if (video.name) {
      // Define the filename.
      const filename: string = video.name.split(' ').join('-').toLowerCase();

      editedReview.videoTitle = filename;
      editedReview.videoSize = video.size;
      editedReview.videoFileType = video.type;
    }

    // If this is a YouTube video.
    if (editedReview.videoType === VideoType.YOUTUBE) {
      editedReview.endTime = review.endTime;
      editedReview.startTime = review.startTime;
      editedReview.videoURL = review.videoURL;
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
        setTimeout(() => {

          setUpdatingPoster(false);

          // Set the submission state.
          setSubmitting(false);

          setReview({
            ...response.review
          });

          // Display the success message to the user.
          enqueueSnackbar('Rave updated successfully', { variant: 'success' });

        }, updatedPoster ? 5000 : 0);

        props.history.push('/user/reviews');

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
    <form noValidate autoComplete='off'>
      <Grid
        alignItems='flex-start'
        container
        direction='column'
        className={classes.padding}
      >
        {uploadProgress.state === FileUploadState.WAITING &&
          <Fade in={uploadProgress.state === FileUploadState.WAITING} timeout={300}>
            <React.Fragment>
              <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
                <Typography variant='h3'>
                  Update your title
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
                <Input
                  defaultValue={review.title}
                  handleBlur={updateInputs}
                  name='title'
                  required={true}
                  type='text'
                  title="Title"
                />
              </Grid>
              <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
                <Box className={clsx(classes.posterWrapper)}>
                  {updatingPoster ? (
                    <Skeleton animation='wave' variant='rect' width={400} height={300} />
                  ) : (
                      <img src={review.thumbnail} alt={`${review.title} poster image`} className={clsx(classes.poster)} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
                <ImageUpload 
                  aspectRatio={4/3}
                  id={review._id}
                  buttonTitle='Change rave poster'
                  maxFileSize={0.2}
                  path={review.thumbnail || ''} 
                  requestPath={ImageUploadPaths.RAVE_POSTER}
                  update={updatePoster} 
                />
              </Grid>
              <Recommendation 
                update={updateRecommendation} 
                recommended={review.recommended}
              />
              <Sponsored
                update={updatedSponsorship}
                sponsored={review.sponsored}
              />
              <Grid item xs={12} lg={6} style={{marginBottom: '1rem', marginTop: '1rem', width: '100%'}}>
                <Typography variant='h3' style={{}}>
                  Review details
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} style={{marginBottom: '1rem', width: '100%'}}>
                <Typography variant='subtitle1' gutterBottom>
                  Do you have a link for users to purchase the product and support you?
                </Typography>
              </Grid>
              {review.links.map((reviewLink: ReviewLink, index: number) => {
                return (
                  <AddReviewLink
                    index={index}
                    key={index}
                    link={reviewLink}
                    update={updateReviewLinks}
                  />
                )
              })}
              <Grid item xs={12} lg={6} style={{marginBottom: '1rem', width: '100%'}}>
                <Typography variant='subtitle1' gutterBottom>
                  Do you have additional information?
                </Typography>
              </Grid>
              <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
                <Input
                  defaultValue={review.description}
                  handleBlur={updateInputs}
                  multiline
                  name='description'
                  required={false}
                  rows={4}
                  rowsMax={10}
                  type='text'
                  title="Description"
                />
              </Grid>
              <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
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
                  <Grid item xs={12} lg={6} style={{marginBottom: review.videoURL ? '0' : '3rem', width: '100%'}}>
                    <FileUpload name='videoFile' update={updateVideo} filename={video.name}/>
                  </Grid>
                  { review.videoURL &&
                    <Grid item xs={12} lg={6} style={{marginTop: '1rem', marginBottom: '3rem', width: '100%'}}>
                      <StyledButton
                        clickAction={(
                          e: React.MouseEvent<HTMLButtonElement>
                        ) => editVideo(false)}
                        color='primary'
                        size='large'
                        title={'Cancel'}
                      />
                    </Grid>
                  }
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', width: '100%'}}>
                    <RaveVideo review={review} />
                  </Grid>
                  { youTubeAccount ? (
                    <Grid item xs={12} lg={6} style={{marginBottom: '3rem', width: '100%'}}>
                      <Grid item xs={12} style={{marginBottom: theme.spacing(1)}}>
                        <Input
                          defaultValue={review.videoURL}
                          handleBlur={updateInputs}
                          name='videoURL'
                          required={true}
                          type='text'
                          title="YouTube URL"
                        />
                      </Grid>
                      <Grid item xs={12} style={{marginBottom: '1.5rem'}}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Input
                              defaultValue={`${review.startTime}`}
                              handleBlur={updateInputs}
                              name='startTime'
                              required={true}
                              type='text'
                              title="Start video at (in seconds)"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Input
                              defaultValue={`${review.endTime}`}
                              handleBlur={updateInputs}
                              name='endTime'
                              required={true}
                              type='text'
                              title="End video at (in seconds)"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item xs={12} lg={6} style={{marginBottom: '3rem', width: '100%'}}>
                      <StyledButton
                        clickAction={(
                          e: React.MouseEvent<HTMLButtonElement>
                        ) => editVideo(true)}
                        color='primary'
                        size='large'
                        title={review.videoURL ? 'Upload new video' : 'Upload'}
                      />
                    </Grid>
                  )}
                </React.Fragment>
              )}
              <Grid item xs={12}>
                <StyledButton
                  clickAction={handleSubmit}
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
    </form>
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

  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;
  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile,
    xsrf: xsrfToken
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(EditReviewForm));

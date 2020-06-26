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
import AddReviewLink from '../addReviewLink/AddReviewLink';
import Sponsored from '../sponsored/Sponsored';
import StyledButton from '../../elements/buttons/StyledButton';
import PaddedDivider from '../../elements/dividers/PaddedDivider';

// Enumerators.
import {
  RequestType
} from '../../../utils/api/Api.enum';
import { Recommended } from '../recommendation/Recommendation.enum';
import { FileUploadState } from '../../forms/fileUpload/FileUpload.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
import { FileUploadStatus } from '../../forms/fileUpload/FileUpload.interface';
import { InputData } from '../../forms/input/Input.interface';
import {
  AddReviewFormRequest,
  AddReviewFormResponse, 
  AddReviewFormProps,
  AddReviewMetadataResponse
} from './AddReviewForm.interface';
import { PrivateProfile } from '../../user/User.interface';
import { Product } from '../../product/Product.interface';
import { ReviewLink } from '../Review.interface';
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
  ctaButton: {
    marginTop: theme.spacing(3)
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
  },
  padding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
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
 * Formats the event data based on the values provided.
 */
const formatEventData: (
  product: Product
) => (
  review: AddReviewFormRequest
) => (
  video: File
) => (
  profile: PrivateProfile
) => EventObject = (
  product: Product
) => (
  review: AddReviewFormRequest
) => (
  video: File
) => (
  profile: PrivateProfile
): EventObject => {
  // Create the event object from the provided values.
  let eventData: EventObject = {
    'brand name': product.brand,
    'product id': product._id,
    'product name': product.name,
    'product recommended': review.recommended === Recommended.RECOMMENDED,
    'sponsored review': review.sponsored,
  };

  if (review.links.length > 0) {
    eventData['review url provided'] = review.links[0].path !== '';
    eventData['review promo provided'] = review.links[0].code !== ''; 
    eventData['review promo information provided'] = review.links[0].info !== '';
  }

  if (product.categories && product.categories.length > 0) {
    eventData['product category'] = product.categories[0].key;

    if (product.categories.length > 1) {
      eventData['product sub-category'] = product.categories[1].key;
    }
  }

  if (profile) {
    eventData['reviewer'] = profile.handle;
  }

  eventData['review title'] = review.title;
  eventData['review description provided'] = review.description !== '';

  if (video && video.type) {
    eventData['video type'] = `${video.type}`;
    eventData['video size'] = video.size;
  }

  return eventData;
}

/**
 * Add review form component.
 */
const AddReviewForm: React.FC<AddReviewFormProps> = (props: AddReviewFormProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Define the review details.
  const [review, setReview] = React.useState<AddReviewFormRequest>({
    description: '',
    links: [{
      code: '',
      info: '',
      path: ''
    }],
    product: props.product._id,
    recommended: Recommended.RECOMMENDED,
    sponsored: false,
    title: '',
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

    // Create the event object from the provided values.
    if (video && props.profile) {
      let eventData: EventObject = formatEventData({
        ...props.product
      })({
        ...review
      })(
        video
      )({
        ...props.profile
      });

      if (data.key === 'title') {
        eventData['review title'] = data.value;
      }

      if (data.key === 'description') {
        eventData['review description'] = data.value !== '';
      }

      analytics.trackEvent(`add review ${data.key}`)(eventData);
    }
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

    // Create the event object from the provided values.
    if (video && props.profile) {
      let eventData: EventObject = formatEventData({
        ...props.product
      })({
        ...review
      })(
        video
      )({
        ...props.profile
      });

      eventData['product recommended'] = recommended === Recommended.NOT_RECOMMENDED;

      analytics.trackEvent(`add product recommendation`)(eventData);
    }
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
    const current: AddReviewFormRequest = { ...review };

    // If we have an index for the current link, update the values.
    if (current.links[index]) {
      current.links[index] = {...reviewLink};
    }

    setReview({
      ...current,
    });

    // Create the event object from the provided values.
    if (video && props.profile) {
      let eventData: EventObject = formatEventData({
        ...props.product
      })({
        ...review
      })(
        video
      )({
        ...props.profile
      });

      eventData['review url provided'] = current.links[0].path !== '';
      eventData['review promo provided'] = current.links[0].code !== ''; 
      eventData['review promo information provided'] = current.links[0].info !== '';

      analytics.trackEvent(`add review link`)(eventData);
    }
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

    // Create the event object from the provided values.
    if (video && props.profile) {
      let eventData: EventObject = formatEventData({
        ...props.product
      })({
        ...review
      })(
        video
      )({
        ...props.profile
      });

      eventData['sponsored review'] = sponsored;

      analytics.trackEvent(`add sponsored`)(eventData);
    }

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

    // Create the event object from the provided values.
    if (video && props.profile) {
      let eventData: EventObject = formatEventData({
        ...props.product
      })({
        ...review
      })(
        uploadFile
      )({
        ...props.profile
      });

      analytics.trackEvent(`add review video`)(eventData);
    }
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

      // Create the event object from the provided values.
      if (video && props.profile) {
        let eventData: EventObject = formatEventData({
          ...props.product
        })({
          ...review
        })(
          video
        )({
          ...props.profile
        });

        eventData['review id'] = reviewId;

        analytics.trackEvent(`complete video upload`)(eventData);
      }

    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

  /**
   * Submits the review for creation.
   */
  const submit: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void> = async (
    e: React.MouseEvent<HTMLButtonElement>
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

      // Create the event object from the provided values.
      if (video && props.profile) {
        let eventData: EventObject = formatEventData({
          ...props.product
        })({
          ...review
        })(
          video
        )({
          ...props.profile
        });

        eventData['review id'] = response.review._id;

        analytics.trackEvent(`add new review`)(eventData);
      }

      Object.keys(response.presigned.fields).forEach((key: string) => {
        data.append(key, response.presigned.fields[key]);
      })

      data.append('file', video);

      // Add an event listener for the upload progress.
      request.upload.addEventListener('progress', (e: ProgressEvent) => {
        let progress: number = (e.loaded / e.total) * 100;

        if (e.loaded) {
          setUploadProgress({
            state: FileUploadState.SUBMITTED,
            completion: progress
          });
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
   * Navigate to your raves.
   */
  const navigateToMyRaves: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    props.history.push('/user/reviews');
  }

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
      className={clsx(classes.padding)}
    >
      {uploadProgress.state === FileUploadState.WAITING &&
        <Fade in={uploadProgress.state === FileUploadState.WAITING} timeout={300}>
          <form noValidate autoComplete='off'>
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
                At ravebox, we're all about honest reviews that get straight to the point. That's why raves are limited to one minute and we encourage you to review products you love <Box component='span' style={{fontWeight: 700}}>and</Box> ones you don't.
              </Typography>
            </Grid>
            <Recommendation 
              update={updateRecommendation} 
              recommended={review.recommended}
            />
            <Sponsored
              update={updatedSponsorship}
              sponsored={review.sponsored}
            />
            <Grid item xs={12} lg={6} style={{marginBottom: '1rem', marginTop: '1rem'}}>
              <Typography variant='h3' style={{}}>
                Review details
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '1rem'}}>
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
            <Grid item xs={12} lg={6} style={{marginBottom: '1rem'}}>
              <Typography variant='subtitle1' gutterBottom>
                Do you have additional information?
              </Typography>
            </Grid>
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Input
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
            <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem'}}>
              <Typography variant='h3'>
                Review video
              </Typography>
              <List>
                <ListItem>
                  Videos must be less than one minute in length
                </ListItem>
                <ListItem>
                  Videos are best viewed when recorded in landscape
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
          </form>
        </Fade>
      }
      {uploadProgress.state === FileUploadState.SUBMITTED &&
        <Fade in={uploadProgress.state === FileUploadState.SUBMITTED} timeout={300}>
          <Grid item xs={12} lg={6}>
            <Typography variant='h2' color='primary' style={{marginBottom: '2rem'}}>We're uploading your rave</Typography>
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
          <React.Fragment>
            <Grid item xs={12}>
              <Typography variant='h2' color='primary' style={{marginBottom: '2rem'}}>Upload successful</Typography>
              <Typography variant='body1' gutterBottom>
                <Box component='p'>
                  Great news, we've sucessfully uploaded your new rave!
                </Box>
                <Box component='p'>
                  We need to process your video before it goes live but rest assured, we'll notify you as soon as it is live.
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.ctaButton}>
              <StyledButton
                color='secondary'
                clickAction={navigateToMyRaves}
                submitting={false}
                title='View your raves'
              />
            </Grid>
          </React.Fragment>
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
)(AddReviewForm));

/**
 * AddReviewForm.tsx
 * AddReviewForm component to add a new review.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Cookies from 'universal-cookie';

// Components.
import Input from '../../forms/input/Input';
import FileUpload from '../../forms/fileUpload/FileUpload';
import Recommendation from '../recommendation/Recommendation';

// Enumerators.
import {
  RequestType
} from '../../../utils/api/Api.enum';
import { Recommended } from '../recommendation/Recommendation.enum';
import { FileUploadState } from '../../forms/fileUpload/FileUpload.enum';

// Interfaces.
import { FileUploadStatus } from '../../forms/fileUpload/FileUpload.interface';
import { InputData } from '../../forms/input/Input.interface';
import {
  ReviewFormResponse, 
  ReviewFormProps,
  ReviewMetadataResponse
} from './ReviewForm.interface';

/**
 * Add review form component.
 */
const AddReviewForm: React.FC<ReviewFormProps> = (props: ReviewFormProps) => {

  // Define the review details.
  const [review, setReview] = React.useState({
    title: '',
    recommended: Recommended.RECOMMENDED,
    product: props.productId,
  });

  const [video, setVideo] = React.useState(new File([''], ''));

  const [uploadProgress, setUploadProgress] = React.useState({
    completion: 0,  
    state: FileUploadState.WAITING
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
   * Submits the review for creation.
   */
  const submit: () => void = (): void => {
    //uploadMetadata('testfile.mov')('5e7dfa55c6a4250061e39571');
    // Define the filename.
    const filename: string = video.name.split(' ').join('-').toLowerCase();

    API.requestAPI<ReviewFormResponse>('review/create', {
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
    .then((response: ReviewFormResponse) => {
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
        }
      });

      // Add an event listener for the upload completion.
      request.upload.addEventListener('load', (e: ProgressEvent) => {
        uploadMetadata(filename)(response.review._id);
      });

      // Add an event listener for the upload error.
      request.upload.addEventListener('error', (e: Event) => {
        console.log('Error uploading');
        setUploadProgress({
          ...uploadProgress,
          state: FileUploadState.WAITING
        });
      });

      request.open('POST', response.presigned.url);

      request.send(data);

    })
    .catch((error: Error) => {
      console.log(error);
    });
  };

  /**
   * Displays the add review form prompt.
   * @method render
   *
   * @return React.ReactNode
   */
  return (
    <div style={{'minWidth': '50%'}}>
      {uploadProgress.state === FileUploadState.WAITING &&
        <Grid
          container
          direction='column'
          spacing={2}
          alignItems='stretch'
        >
          <Grid item xs={12}>
            <Typography variant='h3' gutterBottom>Add your review</Typography>
            <Input
              handleChange={updateInputs}
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
            <FileUpload name='videoFile' update={updateVideo} />
          <Grid item xs={12}>
            <Button
              variant='contained' 
              color='primary'
              onClick={submit}
            >
              Create
            </Button>
          </Grid>
        </Grid>
      }
      {uploadProgress.state === FileUploadState.SUBMITTED &&
        <Grid
          container
          direction='column'
          spacing={2}
          alignItems='stretch'
        >
          <Grid item xs={12}>
            <Typography variant='h3' gutterBottom>Uploading your review</Typography>
            <Typography variant='body1' gutterBottom>
              Hang tight, please don't close this window whilst we upload your review. If you close this window the upload will fail and penguins will perish. Nobody wants that.
            </Typography>
            <Typography variant='h4' gutterBottom style={{textAlign: 'center'}}>
              {Math.ceil(uploadProgress.completion)}% Complete
            </Typography>
            <LinearProgress variant='determinate' value={uploadProgress.completion} />
          </Grid>
        </Grid>
      }
      { uploadProgress.state === FileUploadState.COMPLETE &&
        <Grid
          container
          direction='column'
          spacing={2}
          alignItems='stretch'
        >
          <Grid item xs={12}>
            <Typography variant='h3' gutterBottom>Thanks for submitting your review</Typography>
            <Typography variant='body1' gutterBottom>
              Great news, we've sucessfully uploaded your review! We need to review your video before it goes live but rest assured, we'll notify you as soon as it is live.
            </Typography>
          </Grid>
        </Grid>
      }
    </div>
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
const mapStatetoProps = (state: any, ownProps: ReviewFormProps): ReviewFormProps => {
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

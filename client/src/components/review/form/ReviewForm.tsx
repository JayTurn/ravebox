/**
 * AddReviewForm.tsx
 * AddReviewForm component to add a new review.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Cookies from 'universal-cookie';

// Components.
import Input from '../../forms/input/Input'; 
import Recommendation from '../recommendation/Recommendation';

// Enumerators.
import {
  RequestType
} from '../../../utils/api/Api.enum';
import { Recommended } from '../recommendation/Recommendation.enum';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import {
  ReviewFormResponse, 
  ReviewFormProps
} from './ReviewForm.interface';

/**
 * Add review form component.
 */
const AddReviewForm: React.FC<ReviewFormProps> = (props: ReviewFormProps) => {

  // Define the review details.
  const [review, setReview] = React.useState({
    title: '',
    recommended: Recommended.RECOMMENDED,
    product: props.productId
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
   * Submits the review for creation.
   */
  const submit: () => void = (): void => {
    API.requestAPI<ReviewFormResponse>('review/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify(review)
    })
    .then((response: ReviewFormResponse) => {
      console.log(response);
    })
    .catch((error: Error) => {
      console.error(error);
    })
  };

  /**
   * Displays the add review form prompt.
   * @method render
   *
   * @return React.ReactNode
   */
  return (
    <div style={{'minWidth': '50%'}}>
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
            hasError={''}
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

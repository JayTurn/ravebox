/**
 * AddReviewForm.tsx
 * AddReviewForm component to add a new review.
 */

// Modules.
import API from '../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Input from '../forms/input/Input'; 
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Cookies from 'universal-cookie';

// Components.
import MultistepNavigation from '../multiStepNavigation/MultiStepNavigation';

// Enumerators.
import {
  MultiStepNavigationProgress as Progress
} from '../multiStepNavigation/MultiStepNavigation.enum';

// Interfaces.
import { InputData } from '../forms/input/Input.interface';
//import { PrivateProfile } from '../User.interface';
import {
  AddReviewFormResponse, 
  AddReviewFormProps
} from './AddReviewForm.interface';

/**
 * Add review form component.
 */
const AddReviewForm: React.FC<AddReviewFormProps> = (props: AddReviewFormProps) => {

  // Define the base state for the add review form.
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  });

  // Define the active step.
  const [activeStep, setActiveStep] = React.useState(0);

  const steps: Array<string> = [
    'Product details',
    'Upload review'
  ];

  /**
   * Handles updates to the add review form field.
   *
   * @param { InputData } data - the field data.
   */
  const updateForm: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
    setValues({
      ...values,
      [data.key]: data.value
    });
  }

  /**
   * Displays the add review form prompt.
   * @method render
   *
   * @return React.ReactNode
   */
  return (
    <div style={{'minWidth': '50%'}}>
      <MultistepNavigation steps={steps} activeStep={activeStep} setActiveStep={setActiveStep}/>
      <Grid
        container
        direction='column'
        spacing={2}
        alignItems='stretch'
      >
        <Grid item xs={12} sm={9} md={3}>
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
 * Maps the redux store properties to the add review form component.
 */
const mapStatetoProps = (state: any, ownProps: AddReviewFormProps): AddReviewFormProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
  mapDispatchToProps
)(AddReviewForm));

/**
 * AddReview.tsx
 * AddReview route component.
 */

// Modules.
import * as React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

// Components.
import AddReviewForm from '../../../components/addReviewForm/AddReviewForm';

// Interfaces.
import { AddReviewProps } from './AddReview.interface';

/**
 * AddReview component.
 */
const AddReview: React.FC<AddReviewProps> = (props: AddReviewProps) => {

  return (
    <div className="block block--profile-container">
      <AddReviewForm />
    </div>
  );
}

/**
 * Map the redux state to the add review properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AddReviewProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(AddReview));

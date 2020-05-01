/**
 * ListByQuery.tsx
 * Queries a list of reviews based on the parameters provided.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import { connect } from 'react-redux';
import { frontloadConnect } from 'react-frontload';
import * as React from 'react';

// Actions.
import { updateListByProduct } from '../../../store/review/Actions';

// Components.
import ReviewList from '../list/ReviewList';
import ScrollableReviewList from '../scrollableReviewList/ScrollableReviewList';
import SidebarReviewList from '../sidebarReviewList/SidebarReviewList';

// Enumerators.
import {
  PresentationType,
  QueryPath,
  ReviewListType
} from './ListByQuery.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import {
  ListByQueryProps,
  ListByQueryResponse
} from './ListByQuery.interface';
import { Review } from '../Review.interface';

/**
 * Builds the query based on the list type requested.
 *
 * @param { ReviewListType } listType - the type of list to be queried.
 */
const setQueryListPath: (
  listType: ReviewListType
) => (
  query: string
) => string = (
  listType: ReviewListType
) => (
  query: string
): string => {
  let path: string = '';

  switch (listType) {
    case ReviewListType.PRODUCT:
      path = `${QueryPath.PRODUCT}/${query}`;
      break;
    default:  
  }

  return path;
}

/**
 * Loads the list of reviews from the api before rendering the component.
 * 
 * @param { ListByQueryProps } props - the review details properties.
 */
const frontloadReviewDetails = async (props: ListByQueryProps) => {

  // Define the query to be used for the quest.
  const path: string = setQueryListPath(props.listType)(props.query);

  await API.requestAPI<ListByQueryResponse>(path, {
    method: RequestType.GET
  })
  .then((response: ListByQueryResponse) => {
    // Perform the redux store update based on the list type specified.
    switch (props.listType) {
      case ReviewListType.PRODUCT:
        if (props.updateListByProduct) {
          props.updateListByProduct([...response.reviews]);
        }
        break;
      default:
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};

/**
 * Removes the currrent review from the list if it's present.
 *
 * @param { Review } active - the currently active review.
 * @param { Array<Review> } reviews - the list of reviews.
 *
 * @param Array<Review>
 */
const removeActiveReview: (
  active: Review
) => (
  reviews: Array<Review>
) => Array<Review> = (
  active: Review
) => (
  reviews: Array<Review>
): Array<Review> => {
  const list: Array<Review> = []; 

  let i: number = 0;

  do {
    const current: Review = {...reviews[i]};

    if (current._id !== active._id) {
      list.push({...current});
    }

    i++;
  } while (i < reviews.length);

  return list;
}

/**
 * Returns the list of reviews to the appropriate list.
 *
 * @param { ListByQueryProps } props - the query properties.
 */
const ListByQuery: React.FC<ListByQueryProps> = (props: ListByQueryProps) => {
  let reviews: Array<Review> = [];

  switch (props.listType) {
    case ReviewListType.PRODUCT:
      if (props.listByProduct && props.listByProduct.length > 0) {
        if (props.activeReview) {
          reviews = removeActiveReview(props.activeReview)(props.listByProduct);
        } else {
          reviews = [...props.listByProduct];
        }
      }
      break;
    default:
  }

  return (
    <React.Fragment>
      {props.presentationType === PresentationType.SCROLLABLE &&
        <ScrollableReviewList
          listType={props.listType}
          reviews={reviews}
          retrievalStatus={RetrievalStatus.SUCCESS}
          title={props.title}
        />
      }
      {props.presentationType === PresentationType.SIDEBAR &&
        <SidebarReviewList
          listType={props.listType}
          reviews={reviews}
          retrievalStatus={RetrievalStatus.SUCCESS}
          title={props.title}
        />
      }
      {props.presentationType === PresentationType.GRID &&
        <ReviewList
          reviews={reviews}
          retrievalStatus={RetrievalStatus.SUCCESS}
        />
      }
    </React.Fragment>
  );
}

/**
 * Map dispatch actions to properties on the query list.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateListByProduct
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ListByQueryProps) => {
  // Retrieve the review from the active properties.
  const listByProduct: Array<Review> = state.review ? state.review.listByProduct : [],
        activeReview: Review = state.review ? state.review.active : undefined;

  return {
    ...ownProps,
    listByProduct,
    activeReview
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadReviewDetails,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(ListByQuery)
);

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
import {
  updateListByCategory,
  updateListByProduct
} from '../../../store/review/Actions';

// Components.
import GridReviewList from '../gridReviewList/GridReviewList';
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
  RetrieveListByQueryResponse
} from './ListByQuery.interface';
import {
  Review,
  ReviewGroup
} from '../Review.interface';

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
    case ReviewListType.CATEGORY:
      path = `${QueryPath.CATEGORY}/${query}`;
    default:  
  }

  return path;
}

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

  if (props.reviews && props.reviews.length > 0) {
    switch (props.listType) {
      case ReviewListType.PRODUCT:
        if (props.activeReview && props.reviews && props.reviews.length > 0) {
          reviews = removeActiveReview(props.activeReview)([...props.reviews]);
        } else {
          reviews = [...props.reviews];
        }
        break;
      case ReviewListType.CATEGORY:
          reviews = [...props.reviews];
        break;
      default:
    }
  }

  return (
    <React.Fragment>
      {reviews.length > 0 &&
        <React.Fragment>
          {props.presentationType === PresentationType.SCROLLABLE &&
            <ScrollableReviewList
              context={props.context}
              listType={props.listType}
              reviews={reviews}
              retrievalStatus={RetrievalStatus.SUCCESS}
              title={props.title}
            />
          }
          {props.presentationType === PresentationType.SIDEBAR &&
            <SidebarReviewList
              context={props.context}
              listType={props.listType}
              reviews={reviews}
              retrievalStatus={RetrievalStatus.SUCCESS}
              title={props.title}
            />
          }
          {props.presentationType === PresentationType.GRID &&
            <GridReviewList
              context={props.context}
              listType={props.listType}
              reviews={reviews}
              retrievalStatus={RetrievalStatus.SUCCESS}
              title={props.title}
            />
          }
        </React.Fragment>
      }
    </React.Fragment>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ListByQueryProps) => {
  // Retrieve the review from the active properties.
  const activeReview: Review = state.review ? state.review.active : undefined;

  return {
    ...ownProps,
    activeReview
  };
};

export default connect(mapStateToProps)(ListByQuery);

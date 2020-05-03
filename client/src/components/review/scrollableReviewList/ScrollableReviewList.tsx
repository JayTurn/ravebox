/**
 * ScrollableReviewList.tsx
 * The structured list of reviews positioned in the sidebar.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.
import LoadingReviewList from '../../elements/loadingReviewList/LoadingReviewList';
import ScrollableReviewCard from '../scrollableReviewCard/ScrollableReviewCard';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { Review } from '../Review.interface';
import { ScrollableReviewListProps } from './ScrollableReviewList.interface';

/**
 * Create styles for the review lists.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  listContainer: {
    width: '800px',
    padding: theme.spacing(0),
    //flexWrap: 'nowrap'
  },
  listElement: {
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(0, 1),
    '&:focus': {
      outline: 'none'
    },
    '&:first-child': {
      paddingLeft: theme.spacing(2)
    },
    '&:last-child': {
      paddingRight: theme.spacing(2)
    }
  }
}));

/**
 * Renders the sidebar review list.
 *
 * @param { ScrollableReviewListProps } props - the review list properties.
 */
const ScrollableReviewList: React.FC<ScrollableReviewListProps> = (props: ScrollableReviewListProps) => {
  // Determine if we're need to load private reviews.
  const classes = useStyles();

  const navigate:(
    path: string | number | null
  ) => void = (
    path: string | number | null
  ): void => {
    if (path) {
      props.history.push(`/review/${path}`);
    }
  }

  return (
    <React.Fragment>
      {props.title &&
        <React.Fragment>
          {props.title}
        </React.Fragment>
      }
      {props.retrievalStatus === RetrievalStatus.SUCCESS ? (
        <React.Fragment>
          {props.reviews.length > 0 ? (
            <ScrollMenu
              alignCenter={false}
              data={(props.reviews as Array<Review>).map((review: Review, index: number) => {
                return (
                  <ScrollableReviewCard
                    {...review}
                    key={review.url}
                    listType={props.listType}
                  />
                )})
              }
              inertiaScrolling={true}
              itemClass={classes.listElement}
              onSelect={navigate}
            />
          ) : (
            <React.Fragment>
              No reviews found
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <LoadingReviewList columns={1} height={180} count={6} />
      )}
    </React.Fragment>
  );
}

export default withRouter(ScrollableReviewList);

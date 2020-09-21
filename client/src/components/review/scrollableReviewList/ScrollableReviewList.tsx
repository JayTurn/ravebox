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

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { Review } from '../Review.interface';
import { ScrollableReviewListProps } from './ScrollableReviewList.interface';

// Utilities.
import { formatReviewForTracking } from '../Review.common';

/**
 * Create styles for the review lists.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(3, 0)
  },
  listContainer: {
    width: '800px',
    padding: theme.spacing(0),
    //flexWrap: 'nowrap'
  },
  listElement: {
    cursor: 'pointer',
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
  },
  scrollableWrapper: {
    overflow: 'hidden',
    width: '100%'
  },
  scrollableContainer: {
    whiteSpace: 'nowrap',
    overflowX: 'scroll',
    overflowY: 'hidden',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  }
}));

/**
 * Renders the sidebar review list.
 *
 * @param { ScrollableReviewListProps } props - the review list properties.
 */
const ScrollableReviewList: React.FC<ScrollableReviewListProps> = (props: ScrollableReviewListProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Determine if we're need to load private reviews.
  const classes = useStyles();

  const navigate:(
    index: string | number | null
  ) => void = (
    index: string | number | null
  ): void => {

    // Get the selected review.
    if (index) {
      const review: Review = {...props.reviews[Number(index)]};

      // Format the review for tracking.
      const data: EventObject = formatReviewForTracking(props.context)(review);

      // Track the select event.
      analytics.trackEvent('select review')(data);

      props.history.push(`/review/${review.url}`);
    }
  }

  return (
    <Grid container direction='column' className={clsx(classes.container)}>
      {props.title &&
        <Grid item xs={12}>
            {props.title}
        </Grid>
      }
      {props.retrievalStatus === RetrievalStatus.SUCCESS ? (
        <Grid item xs={12}>
          {props.reviews.length > 0 ? (
            <Box className={clsx(classes.scrollableWrapper)}>
              <Box className={clsx(classes.scrollableContainer)}>
                {(props.reviews as Array<Review>).map((review: Review, index: number) => {
                  return (
                    <ScrollableReviewCard
                      {...review}
                      context={props.context}
                      key={index}
                      listType={props.listType}
                    />
                  )})
                }
              </Box>
            </Box>
          ) : (
            <React.Fragment>
              No reviews found
            </React.Fragment>
          )}
        </Grid>
        /*
        <Grid item xs={12}>
          {props.reviews.length > 0 ? (
            <ScrollMenu
              alignCenter={false}
              data={(props.reviews as Array<Review>).map((review: Review, index: number) => {
                return (
                  <ScrollableReviewCard
                    {...review}
                    context={props.context}
                    key={index}
                    listType={props.listType}
                  />
                )})
              }
              inertiaScrolling={true}
              inertiaScrollingSlowdown={.75}
              itemClass={classes.listElement}
              onSelect={navigate}
            />
          ) : (
            <React.Fragment>
              No reviews found
            </React.Fragment>
          )}
        </Grid>
        */
      ) : (
        <LoadingReviewList columns={1} height={180} count={6} />
      )}
    </Grid>
  );
}

export default withRouter(ScrollableReviewList);

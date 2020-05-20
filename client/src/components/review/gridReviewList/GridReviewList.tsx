/**
 * GridReviewList.tsx
 * The structured list of reviews positioned in a grid.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import LoadingReviewList from '../../elements/loadingReviewList/LoadingReviewList';
import ReviewCard from '../../review/reviewCard/ReviewCard';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { Review } from '../Review.interface';
import { GridReviewListProps } from './GridReviewList.interface';

/**
 * Create styles for the review lists.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(2, 0, 4)
  },
  divider: {
    margin: theme.spacing(2)
  },
  listContainer: {
    padding: theme.spacing(0, 2)
  },
  listElementSmall: {
    borderBottom: `6px solid rgba(0,0,0,0.05)`,
    boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.1)`
  }
}));

/**
 * Renders the grid review list.
 *
 * @param { GridReviewListProps } props - the review list properties.
 */
const GridReviewList: React.FC<GridReviewListProps> = (props: GridReviewListProps) => {
  // Determine if we're need to load private reviews.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <React.Fragment>
      {props.retrievalStatus === RetrievalStatus.SUCCESS ? (
        <React.Fragment>
          {props.reviews.length > 0 ? (
            <Grid container direction='column' className={classes.container}>
              <Grid item xs={12}>
                {props.title &&
                  <React.Fragment>
                    {props.title}
                  </React.Fragment>
                }
              </Grid>
              <Grid item xs={12} className={clsx(
                {
                  [classes.listContainer]: largeScreen
                })}
              >
                <Grid container direction='row' spacing={3}>
                  {(props.reviews as Array<Review>).map((review: Review) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={review._id}
                        className={clsx({
                          [classes.listElementSmall]: !largeScreen
                        })}
                      >
                        <ReviewCard
                          {...review}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            </Grid>
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

export default withRouter(GridReviewList);

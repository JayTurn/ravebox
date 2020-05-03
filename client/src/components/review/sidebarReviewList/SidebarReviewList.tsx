/**
 * SidebarReviewList.tsx
 * The structured list of reviews positioned in the sidebar.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.
import LoadingReviewList from '../../elements/loadingReviewList/LoadingReviewList';
import SidebarReviewCard from '../sidebarReviewCard/SidebarReviewCard';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { Review } from '../Review.interface';
import { SidebarReviewListProps } from './SidebarReviewList.interface';

/**
 * Create styles for the review lists.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  divider: {
    margin: theme.spacing(2)
  },
  listContainer: {
    padding: theme.spacing(0),
  },
  listElement: {
    //margin: theme.spacing(0, 0, 2)
  }
}));

/**
 * Renders the sidebar review list.
 *
 * @param { SidebarReviewListProps } props - the review list properties.
 */
const SidebarReviewList: React.FC<SidebarReviewListProps> = (props: SidebarReviewListProps) => {
  // Determine if we're need to load private reviews.
  const classes = useStyles();

  return (
    <React.Fragment>
      {props.retrievalStatus === RetrievalStatus.SUCCESS ? (
        <React.Fragment>
          {props.reviews.length > 0 ? (
            <Grid container direction='column' className={classes.listContainer}>
              {props.title &&
                <React.Fragment>
                  {props.title}
                </React.Fragment>
              }
              {(props.reviews as Array<Review>).map((review: Review) => {
                return (
                  <Grid item xs={12} key={review._id}
                    className={classes.listElement}
                  >
                    <SidebarReviewCard
                      {...review}
                      listType={props.listType}
                    />
                  </Grid>
                );
              })}
              <Divider className={classes.divider}/>
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

export default withRouter(SidebarReviewList);

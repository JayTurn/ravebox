/**
 * Following.tsx
 * Route for retrieving the authenticated user's followed reviews.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { setReviews } from '../../../store/user/Actions';

// Components.
import PageTitle from '../../../components/elements/pageTitle/PageTitle';
import ReviewList from '../../../components/review/list/ReviewList';
import StyledButton from '../../../components/elements/buttons/StyledButton';
import LoadingReviewList from '../../../components/placeholders/loadingReviewList/LoadingReviewList';

// Enumerators.
import { PresentationType } from '../../../components/review/listByQuery/ListByQuery.enum';
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { ScreenContext } from '../../../components/review/Review.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useRetrieveFollowing } from './useRetrieveFollowing.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { FollowingProps } from './Following.interface';
import { Review } from '../../../components/review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerPadding: {
      padding: theme.spacing(0, 2)
    },
    ctaButton: {
      marginTop: theme.spacing(3)
    },
    ctaWrapper: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(0, 2),
      textAlign: 'center'
    },
    ctaWrapperDesktop: {
      padding: theme.spacing(6, 2),
    }
  })
);

/**
 * Route to retrieve the user's followed reviews.
 */
const Following: React.FC<FollowingProps> = (props: FollowingProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Retieve the followed reviews for the current user.
  const {
    reviews,
    retrievalStatus
  } = useRetrieveFollowing({
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: 'Following'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed, props.location.pathname]);

  /**
   * Navigates to the discover screen.
   */
  const discoverReviews: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    props.history.push('/discover');
  }

  return (
    <Grid container direction='column'>
      <Helmet>
        <title>Following - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/user/following' />
      </Helmet>
      <PageTitle title='Following' />
      {retrievalStatus === RetrievalStatus.WAITING || retrievalStatus === RetrievalStatus.REQUESTED ? (
        <LoadingReviewList presentationType={PresentationType.GRID}/>
      ) : (
        <Grid item xs={12} className={clsx(
          {
            [classes.containerPadding]: largeScreen
          }
        )}>
          {retrievalStatus === RetrievalStatus.SUCCESS ? (
            <ReviewList
              context={ScreenContext.FOLLOWING}
              reviews={reviews || []} 
              retrievalStatus={RetrievalStatus.SUCCESS}
            />
          ) : (
            <Grid container direction='column' className={clsx(classes.ctaWrapper, { 
                [classes.ctaWrapperDesktop]: largeScreen
              })}
            >
              <Grid item xs={12}>
                <Typography variant='h2'>
                  Start following ravers
                </Typography>
                <Typography variant='body1'>
                  When you follow a raver, their raves will appear here. What are you waiting for?
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction='column' alignItems='center' className={classes.ctaButton}>
                  <Grid item xs={12}>
                    <StyledButton
                      color='secondary'
                      clickAction={discoverReviews}
                      submitting={false}
                      title='Discover ravers'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default withRouter(Following);

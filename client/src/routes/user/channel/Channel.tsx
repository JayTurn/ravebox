/**
 * Channel.tsx
 * User channel route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/channel/Actions';

// Components.
import ChannelTitle from '../../../components/channel/title/ChannelTitle';
import ReviewList from '../../../components/review/list/ReviewList';
import StreamUserProfile from '../../../components/raveStream/userProfile/StreamUserProfile';
import UserTabs from '../../../components/user/tabs/UserTabs';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import { ScreenContext } from '../../../components/review/Review.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import {
  useRetrieveUserChannel
} from './useRetrieveUserChannel.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  ChannelDetails,
  ChannelProps,
  ChannelProfile,
  ChannelResponse
} from './Channel.interface';

// Utilities.
import { CountIdentifier } from '../../../utils/display/numeric/Numeric';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listContainer: {
      padding: 0
    },
    listContainerLarge: {
      padding: theme.spacing(0, 2)
    },
    profileContainer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(4)
    }
  })
);

/**
 * Formats the raves count and followers into a statistics string.
 *
 * @param { number } ravesCount - the number of raves.
 * @param { number } followers - the number of followers.
 *
 * @return string
 */
const retrieveStatistics: (
  ravesCount: number
) => (
  followersCount: number
) => string = (
  ravesCount: number
) => (
  followersCount: number
): string => {
    let statistics: string = '';

    const raves: string = CountIdentifier(ravesCount)('rave');

    statistics += ravesCount;

    if (followersCount > 0) {
      const followers: string = CountIdentifier(followersCount)('follower');

      if (ravesCount > 0) {
        statistics += ` | `;
      }

      statistics += `${followers}`;
    }

  return statistics;
}

/**
 * Loads the channel from the api before rendering the component the first time.
 * 
 * @param { ReviewDetailsProps } props - the review details properties.
 */
const frontloadReviewDetails = async (props: ChannelProps) => {
  /*
  // Retrieve the user's handle from the url path.
  const { handle } = {...props.match.params};

  // Perform the request to the api.
  await API.requestAPI<ChannelResponse>(`user/channel/${handle}`, {
    method: RequestType.GET
  })
  .then((response: ChannelResponse) => {
    if (response.channel && props.updateActive) {

      if (response.channel.profile) {
        const statistics: string = retrieveStatistics(
          response.channel.profile.statistics.ravesCount
        )(response.channel.profile.statistics.followers); 

        const channelDetails = {
          profile: {
            _id: response.channel.profile._id,
            avatar: response.channel.profile.avatar,
            followers: response.channel.profile.statistics.followers,
            handle: response.channel.profile.handle,
            ravesCount: response.channel.profile.statistics.ravesCount,
            statistics: statistics
          },
          reviews: response.channel.reviews
        };

        props.updateActive(channelDetails);
      }
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
  */
};


/**
 * Channel component.
 */
const Channel: React.FC<ChannelProps> = (props: ChannelProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Retrieve the user's handle from the url path.
  const { handle } = {...props.match.params};

  // Register the hook for subsequent channel retrieval.
  const { retrievalStatus } = useRetrieveUserChannel({
    handle: handle,
    channel: props.channel,
    updateActive: props.updateActive
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed && props.channel && props.channel.profile) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: `${props.channel.profile.handle} reviews`
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed, props.location.pathname, props.channel]);

  return (
    <Grid container>
      {retrievalStatus === ViewState.FOUND && 
        <React.Fragment>
          {props.channel && props.channel.profile &&
            <React.Fragment>
              <Grid item xs={12} className={clsx(classes.profileContainer)}>
                <StreamUserProfile     
                  showFollow={true}
                  user={props.channel.profile}
                  variant='large'
                />
              </Grid>
              <Grid item xs={12}>
                <UserTabs
                  user={props.channel.profile}
                  raveStreams={props.channel.raveStreams}
                />
              </Grid>
            </React.Fragment>
          }
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the channel.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateActive: updateActive
    },
    dispatch
  );

/**
 * Map the redux state to the profile properties.
 *
 */
function mapStateToProps(state: any, ownProps: ChannelProps) {
  const channel: ChannelDetails = state.channel ? state.channel.active : undefined;
  return {
    ...ownProps,
    channel
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadReviewDetails,
  {
    noServerRender: false,     
    onMount: false,
    onUpdate: false
  })(Channel)
));

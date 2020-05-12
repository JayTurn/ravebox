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
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/channel/Actions';

// Components.
import ChannelTitle from '../../../components/channel/title/ChannelTitle';
import ReviewList from '../../../components/review/list/ReviewList';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Hooks.
import { useRetrieveChannel } from './useRetrieveChannel';

// Interfaces.
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
    }
  })
);

/**
 * Loads the channel from the api before rendering the component the first time.
 * 
 * @param { ReviewDetailsProps } props - the review details properties.
 */
const frontloadReviewDetails = async (props: ChannelProps) => {
  // Retrieve the user's handle from the url path.
  const { handle } = {...props.match.params};

  // Perform the request to the api.
  await API.requestAPI<ChannelResponse>(`user/channel/${handle}`, {
    method: RequestType.GET
  })
  .then((response: ChannelResponse) => {
    if (response.channel && props.updateActive) {

      if (response.channel.profile) {
        const channelDetails = {
          profile: {
            _id: response.channel.profile._id,
            handle: response.channel.profile.handle,
            ravesCount: CountIdentifier(response.channel.reviews ? response.channel.reviews.length : 0)('rave')
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
};


/**
 * Channel component.
 */
const Channel: React.FC<ChannelProps> = (props: ChannelProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Retrieve the user's handle from the url path.
  const { handle } = {...props.match.params};

  // Register the hook for subsequent channel retrieval.
  const { retrievalStatus } = useRetrieveChannel({
    handle: handle,
    channel: props.channel,
    updateActive: props.updateActive
  });

  return (
    <React.Fragment>
      {retrievalStatus === RetrievalStatus.SUCCESS &&
        <React.Fragment>
          {props.channel && 
            <Grid container direction='column'>
              {props.channel.profile &&
                <Grid item xs={12}>
                    <ChannelTitle
                      handle={props.channel.profile.handle}
                      ravesCount={props.channel.profile.ravesCount || ''} />
                </Grid>
              }
              {props.channel.reviews && props.channel.reviews.length > 0 &&
                <Grid item xs={12} className={clsx(
                    classes.listContainer,
                    {
                      [classes.listContainerLarge]: largeScreen
                    }
                  )}
                >
                  <ReviewList reviews={props.channel.reviews} retrievalStatus={RetrievalStatus.SUCCESS} />
                </Grid>
              }
            </Grid>
          }
        </React.Fragment>
      }
    </React.Fragment>
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

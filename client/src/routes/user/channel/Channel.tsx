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
import { connect } from 'react-redux';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router';
import * as React from 'react';

// Actions.
import { updateActive } from '../../../store/channel/Actions';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import {
  ChannelDetails,
  ChannelProps,
  ChannelResponse
} from './Channel.interface';

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
    if (props.updateActive) {
      props.updateActive({...response.channel});
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

  return (
    <Grid container direction='column'>
      <Grid item>
        {props.channel &&
          <h1>{}</h1>
        }
      </Grid>
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
    onMount: true,
    onUpdate: false
  })(Channel)
));

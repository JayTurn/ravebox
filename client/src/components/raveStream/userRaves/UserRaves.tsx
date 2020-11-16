/**
 * UserRaves.tsx
 * Rave information component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import LoadingRaveStream from '../../placeholders/loadingRaveStream/LoadingRaveStream';
import ProductDescription from '../productDescription/ProductDescription';
import SwipeCardHolder from '../../swipeStream/cardHolder/SwipeCardHolder';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';
import { Role } from '../../user/User.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useRetrieveUserRaveStreams } from './useRetrieveUserRaveStreams.hook';

// Interfaces.
import { UserRavesProps } from './UserRaves.interface';
import { RaveStream } from '../RaveStream.interface';
import {
  Review,
  ReviewLink
} from '../../review/Review.interface';

// Utilities.
import { getExternalAvatar } from '../../user/User.common';
import { filterReviews } from '../../review/Review.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({ })
);

/**
 * Renders the rave information.
 */
const UserRaves: React.FC<UserRavesProps> = (props: UserRavesProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [userId, setUserId] = React.useState<string>('');

  const [height, setHeight] = React.useState<number>(0);

  const [ravesCount, setRavesCount] = React.useState<number>(0);

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      if (ref.current.clientHeight < 600) {
        setHeight(ref.current.clientHeight);
        props.updateHeight(600);
      } else {
        setHeight(ref.current.clientHeight);
        props.updateHeight(ref.current.clientHeight + 30);
      }
    }
  }

  const {
    raveStreams,
    raveStreamsStatus
  } = useRetrieveUserRaveStreams({
    user: props.user,
    updateHeight: handleHeightUpdate
  });

  /**
   * Returns the height of the element when it is loaded.
   */
  React.useEffect(() => {
    if (ref && ref.current) {
      if (height !== ref.current.clientHeight) {
        handleHeightUpdate();
      }

      if (props.user && props.user._id !== userId) {
        setUserId(props.user._id);
        handleHeightUpdate();
      }

      if (raveStreams && raveStreams.length !== ravesCount) {
        setRavesCount(raveStreams.length);
        handleHeightUpdate();
      }
    }

  }, [height, ref, props.user, userId, ravesCount, raveStreams]);

  return (
    <Grid container ref={ref}>
      {raveStreamsStatus === ViewState.WAITING &&
        <React.Fragment>
          <Grid item xs={12}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12}>
            <LoadingRaveStream />
          </Grid>
        </React.Fragment>
      }
      {raveStreamsStatus === ViewState.FOUND &&
        <React.Fragment>
          {raveStreams.map((raveStream: RaveStream, index: number) => (
            <Grid item xs={12} key={index}>
              <SwipeCardHolder
                title={raveStream.title}
                streamType={raveStream.streamType}
                reviews={[...raveStream.reviews]}
              />
            </Grid>
          ))}
        </React.Fragment>
      }
    </Grid>
  );
};

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: UserRavesProps) => {
  // Retrieve the current stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined; 

  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  return {
    ...ownProps,
    raveStream,
    review
  };
};

export default connect(
  mapStateToProps
)(UserRaves);

/**
 * RaveStreamMute.tsx
 * Mute buutton for rave streams.
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
import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import VolumeMuteRoundedIcon from '@material-ui/icons/VolumeMuteRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';

// Actions.
import {
  mute
} from '../../../store/video/Actions';

// Interfaces.
import { RaveStreamMuteProps } from './RaveStreamMute.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      color: theme.palette.common.white,
      padding: 0
    },
    icon: {
      fontSize: '1.5rem'
    }
  })
);

/**
 * Renders the mute button component.
 */
const RaveStreamMute: React.FC<RaveStreamMuteProps> = (props: RaveStreamMuteProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  /**
   * Handles the mute state of the videos.
   */
  const handleMute: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    e.stopPropagation();

    if (props.mute) {
      props.mute(!props.muted);
    }

    return;
  }

  /**
   * Handles mouse down and mouse up events to stop proagation.
   */
  const handleMouse: (
    e: React.MouseEvent
  ) => void = (
    e: React.MouseEvent
  ): void => {
    e.stopPropagation();
  }

  return (
    <IconButton
      className={clsx(classes.button)}
      title='Mute audio'
      onClick={handleMute}
      onMouseDown={handleMouse}
      onMouseUp={handleMouse}
    >
      {props.muted ? (
        <VolumeOffRoundedIcon className={clsx(classes.icon)}/>
      ) : (
        <VolumeMuteRoundedIcon className={clsx(classes.icon)}/>
      )}
    </IconButton>
  );
}

/**
 * Map dispatch actions to properties on the stream.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      mute: mute,
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: RaveStreamMuteProps) => {
  const muted: boolean = state.video ? state.video.muted : true;

  return {
    ...ownProps,
    muted
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RaveStreamMute);

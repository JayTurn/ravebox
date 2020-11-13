/**
 * TabContainer.tsx
 * Tab for the category streams.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Box from '@material-ui/core/Box';
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
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  updateActiveCategory,
  updateCategoryList
} from '../../../store/raveStream/Actions';

// Components.
import DesktopCardHolder from '../../desktopStream/cardHolder/DesktopCardHolder';
import SwipeCardHolder from '../../swipeStream/cardHolder/SwipeCardHolder';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import { TabContainerProps } from './TabContainer.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
    },
    cardBackground: {
      backgroundColor: theme.palette.background.paper,
    },
    spaceAbove: {
    },
    spaceBelow: {
    },
    swipeBackground: {
      backgroundColor: `rgba(100, 106, 240, .1)`,
      paddingTop: theme.spacing(.5),
      paddingBottom: theme.spacing(.5),
      '&:first-child': {
        paddingTop: theme.spacing(.5)
      },
      '&:last-child': {
        paddingBottom: theme.spacing(.5)
      }
    }
  })
);

/**
 * Renders the tabs for category streams.
 */
const TabContainer: React.FC<TabContainerProps> = (props: TabContainerProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [height, setHeight] = React.useState<number>(0);

  const [currentIndex, setCurrentIndex] = React.useState<number>(props.activeIndex);

  const [changed, setChanged] = React.useState<boolean>(props.toggleUpdate);

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      let updateHeight: number = ref.current.clientHeight;

      if (!largeScreen && updateHeight < 600) {
        updateHeight = 600;
      }

      if (largeScreen && props.minDesktopHeight) {
        if (updateHeight < props.minDesktopHeight) {
          updateHeight = props.minDesktopHeight;
        }
      }

      setHeight(updateHeight);
      props.updateHeight(updateHeight);
    }
  }

  /**
   * Returns the height of the element when it is loaded.
   */
  React.useEffect(() => {
    if (ref && ref.current) {
      if (props.activeIndex !== currentIndex) {
        if (props.activeIndex === props.index) {
          handleHeightUpdate();
        }
        setCurrentIndex(props.activeIndex);
      } else {
        if (height === 0) {
          if (props.activeIndex === props.index) {
            handleHeightUpdate();
          } else {
            setHeight(ref.current.clientHeight);
          }
        }
      }

      if (props.activeIndex === props.index) {
        if (height !== ref.current.clientHeight) {
          handleHeightUpdate();
        }
      }

      if (changed !== props.toggleUpdate) {
        if (props.activeIndex === props.index) {
          handleHeightUpdate();
        }
        setChanged(props.toggleUpdate);
      }
    }
  }, [
    changed,
    currentIndex,
    height,
    props.activeIndex,
    props.index,
    props.toggleUpdate,
    ref,
  ]);

  return (
    <Grid container className={clsx(classes.container)} ref={ref}>
      {props.children}
    </Grid>
  );
}

export default TabContainer;

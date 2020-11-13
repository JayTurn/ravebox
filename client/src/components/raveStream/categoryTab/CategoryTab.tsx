/**
 * CategoryStreamTab.tsx
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

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import { CategoryStreamTabProps } from './CategoryTab.interface';
import {
  RaveStream,
  RaveStreamCategoryList
} from '../RaveStream.interface';

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
      paddingBottom: theme.spacing(1)
    }
  })
);

/**
 * Renders the tabs for category streams.
 */
const CategoryStreamTab: React.FC<CategoryStreamTabProps> = (props: CategoryStreamTabProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [height, setHeight] = React.useState<number>(0);

  const [currentIndex, setCurrentIndex] = React.useState<number>(props.activeIndex);

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      setHeight(ref.current.clientHeight);
      props.updateHeight(ref.current.clientHeight);
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

      if (props.activeIndex === props.index
        && height !== ref.current.clientHeight) {
        handleHeightUpdate();
      }
    }
  }, [
    currentIndex,
    height,
    props.activeIndex,
    props.index,
    ref,
  ]);

  return (
    <Grid container className={clsx(classes.container)} ref={ref}>
      {props.categoryList.streamItems.map((raveStream: RaveStream, index: number) => (
        <Grid item xs={12}
          className={clsx(
            classes.cardBackground, {
              [classes.swipeBackground]: !largeScreen
            }
          )}
        >
          {largeScreen ? (
            <DesktopCardHolder
              hideProductTitles={raveStream.streamType === RaveStreamType.PRODUCT}
              title={raveStream.title}
              streamType={raveStream.streamType}
              reviews={[...raveStream.reviews]}
            />
          ) : (
            <SwipeCardHolder
              title={raveStream.title}
              streamType={raveStream.streamType}
              reviews={[...raveStream.reviews]}
            />
          )}  
        </Grid>
      ))}
    </Grid>
  );
}

export default CategoryStreamTab;

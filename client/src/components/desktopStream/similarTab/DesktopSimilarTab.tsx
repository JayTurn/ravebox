/**
 * DesktopSimilarTab.tsx
 * DesktopSimilar products component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
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

// Components.
import DesktopCardHolder from '../cardHolder/DesktopCardHolder';
import LoadingRaveStream from '../../placeholders/loadingRaveStream/LoadingRaveStream';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import {
  useRetrieveSimilarProducts
} from '../../raveStream/similarProducts/useRetrieveSimilarProducts.hook';

// Interfaces.
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { DesktopSimilarTabProps } from './DesktopSimilarTab.interface';


/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2)
    },
    noResultsContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      margin: theme.spacing(1),
      padding: theme.spacing(8, 2),
      textAlign: 'center'
    },
    noResultsText: {
      fontSize: '1rem'
    },
    spaceAbove: {
      paddingTop: theme.spacing(.5)
    },
    spaceBelow: {
      paddingBottom: theme.spacing(.5)
    }
  })
);

/**
 * Renders the product images.
 */
const DesktopSimilarTab: React.FC<DesktopSimilarTabProps> = (props: DesktopSimilarTabProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [productId, setProductId] = React.useState<string>(props.product._id);

  const {
    raveStreams,
    raveStreamsStatus
  } = useRetrieveSimilarProducts({
    product: props.product
  });

  const [height, setHeight] = React.useState<number>(0);

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      if (ref.current.clientHeight < 600) {
        setHeight(600);
        props.updateHeight(600);
      } else {
        setHeight(ref.current.clientHeight);
        props.updateHeight(ref.current.clientHeight + 30);
      }
    }
  }

  /**
   * Returns the height of the element when it is loaded.
   */
  React.useEffect(() => {
    if (ref && ref.current) {
      if (height !== ref.current.clientHeight) {
        handleHeightUpdate();
      }
      if (props.product._id !== productId) {
        setProductId(props.product._id);
        handleHeightUpdate();
      }
    }
  }, [height, ref, props.product, productId]);
  
  return (
    <Grid container ref={ref}
      className={clsx(classes.container)}
    >
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
      {raveStreamsStatus === ViewState.FOUND && raveStreams.length > 0 &&
        <React.Fragment>
          {raveStreams.map((raveStream: RaveStream, index: number) => (
            <Grid item xs={12}
              className={clsx({
                [classes.spaceAbove]: index === 0,
                [classes.spaceBelow]: index === raveStreams.length - 1  
              })}
              key={index}
            >
              <DesktopCardHolder
                lg={4}
                md={6}
                sm={12}
                hideProductTitles={false}
                hideStreamTag={true}
                overrideTitle={true}
                streamType={RaveStreamType.COLLECTON}
                reviews={[...raveStream.reviews]}
                title='Similar product raves'
              />
            </Grid>
          ))}
        </React.Fragment>
      }
      {raveStreamsStatus !== ViewState.WAITING && !raveStreams || raveStreams.length <= 0 &&
        <Grid item xs={12} className={clsx(classes.noResultsContainer)}>
          <Typography variant='body1' className={clsx(classes.noResultsText)}>
            Similar products were not found
          </Typography>
        </Grid>
      }
    </Grid>
  );
};

export default DesktopSimilarTab;

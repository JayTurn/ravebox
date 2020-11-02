/**
 * SimilarProducts.tsx
 * Similar products component.
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
import StreamCardHolder from '../cardHolder/StreamCardHolder';
import LoadingRaveStream from '../../placeholders/loadingRaveStream/LoadingRaveStream';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useRetrieveSimilarProducts } from './useRetrieveSimilarProducts.hook';

// Interfaces.
import { RaveStream } from '../RaveStream.interface';
import { SimilarProductsProps } from './SimilarProducts.interface';


/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
const SimilarProducts: React.FC<SimilarProductsProps> = (props: SimilarProductsProps) => {
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
            <Grid item xs={12}
              className={clsx({
                [classes.spaceAbove]: index === 0,
                [classes.spaceBelow]: index === raveStreams.length - 1  
              })}
              key={index}
            >
              <StreamCardHolder
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

export default SimilarProducts;

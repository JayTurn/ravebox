/**
 * StreamProductDetails.tsx
 * Product details for the stream component.
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

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  StreamProductDetailsProps
} from './StreamProductDetails.interface';
import { Product } from '../../product/Product.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: 'red',
      height: 'calc(100vh)',
      overflowY: 'auto'
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600
    }
  })
);

/**
 * Renders the product details in the stream.
 */
const StreamProductDetails: React.FC<StreamProductDetailsProps> = (props: StreamProductDetailsProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        <Typography variant='h2'>
          <Box className={clsx(classes.subtitle)}>{props.product.brand.name}</Box>
          {props.product.name}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default StreamProductDetails;

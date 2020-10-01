/**
 * AdminProducts.tsx
 * Renders the component displaying app products.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Interfaces.
import { AdminProductsProps } from './AdminProducts.interface';

/**
 * Create styles for the admin products screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
}));

/**
 * Renders the list of products for the admin screen.
 */
const AdminProducts: React.FC<AdminProductsProps> = (props: AdminProductsProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid container>
      <Grid item>
        <Typography variant='h2'>
          List of products
        </Typography>
      </Grid>
    </Grid>
  );
}

export default withRouter(AdminProducts);

/**
 * ProductInformation.tsx
 * Rave information component.
 */

// Modules.
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

// Interfaces.
import { ProductInformationProps } from './ProductInformation.interface';
import { RaveStream } from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
    },
    cardContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      margin: theme.spacing(0, 1)
    }
  })
);

/**
 * Renders the rave information.
 */
const ProductInformation: React.FC<ProductInformationProps> = (props: ProductInformationProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  return (
    <Grid className={clsx(classes.container)} container>
      <Grid item xs={12} className={clsx(classes.cardContainer)}>
        <Typography variant='h2'>
          Official product information
        </Typography>
      </Grid>
    </Grid>
  );
};

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ProductInformationProps) => {

  return {
    ...ownProps
  };
};

export default connect(
  mapStateToProps
)(ProductInformation);

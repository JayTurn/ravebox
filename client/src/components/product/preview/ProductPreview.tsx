/**
 * ProductPreview.tsx
 * Preview component of the product details.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { ProductPreviewProps } from './ProductPreview.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(1.5, 2)
  },
  contentPadding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  productName: {
    fontSize: '1rem',
    fontWeight: 600
  },
  productNameLarge: {
    fontSize: '1.1rem'
  },
  productBrand: {
    fontSize: '.8rem',
    fontWeight: 600
  },
  productBrandLarge: {
    fontSize: '.9rem'
  },
  notRecommendedIcon: {
    color: theme.palette.grey.A700
  },
  notRecommendedText: {
    color: theme.palette.grey.A400,
    marginBottom: '8px'
  },
  recommendationConatiner: {
    padding: theme.spacing(.5, 0, 0)
  },
  recommendationIcon: {
    fontSize: '1.15rem',
  },
  recommendationText: {
    display: 'block',
    fontSize: '.85rem',
    fontWeight: 600,
    paddingLeft: theme.spacing(1)
  },
  recommendedIcon: {
    color: theme.palette.secondary.main,
  },
  recommendedText: {
    color: theme.palette.secondary.dark,
    marginBottom: '2px'
  },
  title: {
    color: '#3E42A3'
  },
  titleContainer: {
  }
}));

/**
 * Renders the product preview card component.
 */
const ProductPreview: React.FC<ProductPreviewProps> = (
  props: ProductPreviewProps
) => {

  // Use the custom styles.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid
      container
      direction='column'
      className={classes.container}
    >
      <Grid item xs={12} lg={6}>
        <Typography variant='body2' className={clsx(
          classes.productBrand, {
            [classes.productBrandLarge]: largeScreen
          }
        )}>
          {props.brand}
        </Typography>
        <Typography variant='body1' className={clsx(
          classes.productName, {
            [classes.productNameLarge]: largeScreen
          })}
        >
          {props.name}
        </Typography>
      </Grid>
      {props.recommendation &&
        <Grid item xs={12}>
          <Grid container direction='row' alignItems='center' className={classes.recommendationConatiner}>
            <Grid item>
              <Box>
                {props.recommendation.recommended ? (
                  <ThumbUpRoundedIcon className={clsx(
                      classes.recommendationIcon,
                      classes.recommendedIcon
                    )}
                  />
                ) : (
                  <ThumbDownRoundedIcon className={clsx(
                      classes.recommendationIcon,
                      classes.notRecommendedIcon
                    )}
                  />
                )}
              </Box>
            </Grid>
            <Grid item>
              {props.recommendation.recommended ? (
                <Typography variant='body1' className={clsx(
                    classes.recommendationText,
                    classes.recommendedText
                  )}
                >
                  {props.recommendation.handle} recommends this product
                </Typography>
              ) : (
                <Typography variant='body1' className={clsx(
                    classes.recommendationText,
                    classes.notRecommendedText
                  )}
                >
                  {props.recommendation.handle} doesn't recommend this product
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  );
}

export default ProductPreview;

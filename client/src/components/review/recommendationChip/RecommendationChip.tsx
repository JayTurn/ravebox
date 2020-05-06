/**
 * RecommendationChip.tsx
 * Renders a recommendation chip.
 */

// Modules.
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
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';

// Enumerators.
import { Recommended } from '../recommendation/Recommendation.enum';

// Interfaces.
import { RecommendationChipProps } from './RecommendationChip.interface';

/**
 * Styles for the grids.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
  }
}));

/**
 * Styled not recommended chip.
 */
const NotRecommendedChip = withStyles((theme: Theme) => ({
  root: {
    height: 20,
    backgroundColor: theme.palette.grey.A700,
  },
  icon: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 16,
    boxShadow: `0 0 0 2px ${theme.palette.grey.A700}`,
    color: theme.palette.grey.A700,
    fontSize: '1.15rem',
    height: 16,
    margin: 0,
    padding: 2,
    width: 19
  },
  label: {
    color: theme.palette.common.white,
    fontSize: `.75rem`,
    fontWeight: 700,
    paddingLeft: theme.spacing(1),
    marginTop: -1,
    textShadow: `0 1px 1px rgba(0,0,0,0.3)`
  }
}))(Chip);

/**
 * Styled recommended chip.
 */
const RecommendedChip = withStyles((theme: Theme) => ({
  root: {
    height: 20,
    backgroundColor: theme.palette.secondary.dark,
  },
  icon: {
    backgroundColor: theme.palette.common.white,
    borderRadius: 20,
    boxShadow: `0 0 0 2px ${theme.palette.secondary.dark}`,
    color: theme.palette.secondary.dark,
    fontSize: '1.15rem',
    height: 16,
    margin: 0,
    padding: 2,
    width: 16
  },
  label: {
    color: theme.palette.common.white,
    fontSize: `.75rem`,
    fontWeight: 700,
    paddingLeft: theme.spacing(1),
    marginTop: -1,
    textShadow: `0 1px 1px rgba(0,32,27,0.3)`
  }
}))(Chip);

/**
 * Renders the recommendation chip component.
 */
const RecommendationChip: React.FC<RecommendationChipProps> = (
  props: RecommendationChipProps
) => {
  // Define the shared classes.
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      className={classes.container}
    >
      <Grid item xs={12}>
        {props.recommended ? (
          <RecommendedChip
            icon={
              <ThumbUpAltRoundedIcon />
            }
            label={`recommends this product`}
          />
        ): (
          <NotRecommendedChip
            icon={
              <ThumbDownAltRoundedIcon />
            }
            label={`doesn't recommend this product`}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default RecommendationChip;

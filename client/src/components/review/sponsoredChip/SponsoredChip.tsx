/**
 * SponsoredChip.tsx
 * Renders a sponsored chip.
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

// Interfaces.
import { SponsoredChipProps } from './SponsoredChip.interface';

/**
 * Styles for the grids.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
  }
}));

/**
 * Styled sponsored chip.
 */
const SponsoredStyledChip = withStyles((theme: Theme) => ({
  root: {
    height: 20,
    backgroundColor: theme.palette.common.white,
    boxShadow: `0 0 0 1px ${theme.palette.grey.A200}`,
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
    color: theme.palette.grey.A700,
    fontSize: `.75rem`,
    fontWeight: 500,
    //paddingLeft: theme.spacing(1),
    marginTop: -1,
    //textShadow: `0 1px 1px rgba(0,0,0,0.3)`
  }
}))(Chip);

/**
 * Renders the sponsored chip component.
 */
const SponsoredChip: React.FC<SponsoredChipProps> = (
  props: SponsoredChipProps
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
        <SponsoredStyledChip
          label={`sponsored rave`}
        />
      </Grid>
    </Grid>
  );
};

export default SponsoredChip;

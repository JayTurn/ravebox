/**
 * AccessType.tsx
 * Component displaying the access tabs.
 */

// Modules.
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Enumerators.
import { AccessOptions } from './AccessType.enum';

// Interfaces.
import { AccessTypeProps } from './AccessType.interface';

const AccessTabs = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.secondary.main}`
  }
}))(Tabs);

/**
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(0, 1),
    marginBottom: theme.spacing(2)
  },
  desktopContainer: {
    padding: 0,
    marginBottom: theme.spacing(3)
  },
  titleContainer: {
    margin: theme.spacing(3, 0, 2)
  }
}));

/**
 * Access type component.
 */
const AccessType: React.FC<AccessTypeProps> = (props: AccessTypeProps) => {

  const theme = useTheme(),
        classes = useStyles();

  /**
   * Redirects the user to the selected path.
   *
   * @param { React.}
   */
  const navigate: (
    value: AccessOptions
  ) => void = (
    value: AccessOptions
  ): void => {
    if (value === props.selected) {
      return;
    }

    switch (value) {
      case AccessOptions.SIGNUP:
        props.history.push('/user/signup');
        break;
      default:
        props.history.push('/user/login');
    }
  }

  // Match the small media query size.
  const desktop = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid
      container
      direction='column'
      className={clsx(classes.container, {
        [classes.desktopContainer]: desktop
      })}
    >
      <Grid item xs={12} md={6} className={classes.titleContainer}>
        {props.selected === AccessOptions.SIGNUP ? (
          <Typography variant='h1' color='textPrimary'>
            Sign up to ravebox
          </Typography>
        ) : (
          <Typography variant='h1' color='textPrimary'>
            Log in to ravebox
          </Typography>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <AccessTabs
          value={props.selected}
          variant={desktop ? 'standard' : 'fullWidth'}
        >
          <Tab
            disableRipple
            label={'Log in'}
            onClick={(e: React.SyntheticEvent) => {
              navigate(AccessOptions.LOGIN);
            }}
            value={AccessOptions.LOGIN}
          />
          <Tab
            disableRipple
            label={'Sign up'}
            onClick={(e: React.SyntheticEvent) => {
              navigate(AccessOptions.SIGNUP);
            }}
            value={AccessOptions.SIGNUP}
          />
        </AccessTabs>
      </Grid>
    </Grid>
  );
}

/**
 * Maps the redux properties to the access type component.
 */
const mapStatetoProps = (state: any, ownProps: AccessTypeProps): AccessTypeProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps
)(AccessType));

/**
 * AccessType.tsx
 * Component displaying the access tabs.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import {
  styled,
  makeStyles,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import * as React from 'react';
import { connect } from 'react-redux';
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
 * Access type component.
 */
const AccessType: React.FC<AccessTypeProps> = (props: AccessTypeProps) => {

  const theme = useTheme();

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
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid
      container
      direction='column'
      spacing={2}
      alignItems='stretch'
      style={{marginBottom: '1.75rem'}}
    >
      <Grid item xs={12} md={6} style={{marginBottom: '1rem'}}>
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
          variant={largeScreen ? 'standard' : 'fullWidth'}
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

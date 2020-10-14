/**
 * Admin.tsx
 * Admin home screen route component.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import AdminInvitations from '../../components/admin/invitations/AdminInvitations';
import AdminProducts from '../../components/admin/products/AdminProducts';
import AdminReviews from '../../components/admin/reviews/AdminReviews';
import AdminTags from '../../components/admin/tags/AdminTags';
import AdminUsers from '../../components/admin/users/AdminUsers';
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AdminPath } from './Admin.enum';

// Interfaces.
import { AdminProps } from './Admin.interface';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.secondary.main}`
  }
}))(Tabs);

/**
 * Styled error divider.
 */
const StyledDivider = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    margin: theme.spacing(2, 0, 0)
  }
}))(Divider);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    padding: {
      marginBottom: theme.spacing(4),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    titleContainer: {
      margin: theme.spacing(4, 0, 0),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  })
);

/**
 * Admin route component.
 */
const Admin: React.FC<AdminProps> = (props: AdminProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const [selected, setSelected] = React.useState<number | null>(null);

  const [path, setPath] = React.useState<string>(props.location.pathname);

  /**
   * Redirects the user to the selected path.
   *
   * @param { React.}
   */
  const navigate: (
    value: AdminPath | null
  ) => void = (
    value: AdminPath | null
  ): void => {
    // Only navigate if the intended path differs to the current one.
    const navigateTo: string = value ? `${props.match.path}/${value}` : `${props.match.path}`;
    if (value === navigateTo) {
      return;
    }
    props.history.push(navigateTo);
  }

  /**
   * Update the path state based on tab selection.
   */
  React.useEffect(() => {
    if (path !== props.location.pathname) {
      setPath(props.location.pathname);
    }
  }, [path, props.location.pathname]);

  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>Admin - Ravebox</title>
        <meta name='description' content={`Find answers to commonly asked questions about Ravebox, a place to find and compare products through short form videos.`} />
        <link rel='canonical' href='https://ravebox.io/about' />
      </Helmet>
      <Grid item xs={12} className={clsx(classes.titleContainer)}>
        <Typography variant='h1' color='textPrimary'>
          Admin
        </Typography>
        <StyledDivider />
      </Grid>
      <Grid item className={clsx(classes.padding)}>
        <StyledTabs
          value={path}
          variant={largeScreen ? 'standard' : 'fullWidth'}
        >
          <Tab
            disableRipple
            label={`Overview`} 
            onClick={(e: React.SyntheticEvent) => {
              navigate(null);
            }}
            value={`${props.match.path}`}
          />
          <Tab
            disableRipple
            label={`Raves`} 
            onClick={(e: React.SyntheticEvent) => {
              navigate(AdminPath.RAVES);
            }}
            value={`${props.match.path}/${AdminPath.RAVES}`}
          />
          <Tab
            disableRipple
            label={`Products`} 
            onClick={(e: React.SyntheticEvent) => {
              navigate(AdminPath.PRODUCTS);
            }}
            value={`${props.match.path}/${AdminPath.PRODUCTS}`}
          />
          <Tab
            disableRipple
            label={`Categories`} 
            onClick={(e: React.SyntheticEvent) => {
              navigate(AdminPath.CATEGORIES);
            }}
            value={`${props.match.path}/${AdminPath.CATEGORIES}`}
          />
          <Tab
            disableRipple
            label={`Users`} 
            onClick={(e: React.SyntheticEvent) => {
              navigate(AdminPath.USERS);
            }}
            value={`${props.match.path}/${AdminPath.USERS}`}
          />
          <Tab
            disableRipple
            label={`INVITATIONS`} 
            onClick={(e: React.SyntheticEvent) => {
              navigate(AdminPath.INVITATIONS);
            }}
            value={`${props.match.path}/${AdminPath.INVITATIONS}`}
          />
        </StyledTabs>
      </Grid>
      <Grid item className={clsx(classes.padding)}>
        <Route exact={true} path={`${props.match.path}/${AdminPath.RAVES}`}>
          <AdminReviews />
        </Route>
        <Route exact={true} path={`${props.match.path}/${AdminPath.PRODUCTS}`}>
          <AdminProducts />
        </Route>
        <Route exact={true} path={`${props.match.path}/${AdminPath.CATEGORIES}`}>
          <AdminTags />
        </Route>
        <Route exact={true} path={`${props.match.path}/${AdminPath.USERS}`}>
          <AdminUsers />
        </Route>
        <Route exact={true} path={`${props.match.path}/${AdminPath.INVITATIONS}`}>
          <AdminInvitations />
        </Route>
      </Grid>
    </Grid>
  );
}

export default withRouter(Admin);

/**
 * AdminUsers.tsx
 * Renders the component displaying app users.
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
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import CreateUser from '../createUser/CreateUser';

// Hooks.
import { useRetrieveUsersList } from './useRetrieveUsersList.hook';

// Interfaces.
import { AdminUsersProps } from './AdminUsers.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Create styles for the review screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  tableContainer: {
    //maxHeight: `calc(100vh - 250px)`
  },
  toolbar: {
    marginBottom: theme.spacing(2)
  },
  headerCell: {
    backgroundColor: `#F1F1F1`,
    borderBottom: `1px solid rgba(200,200,200)`,
    fontWeight: 800,
    textTransform: 'uppercase'
  },
  tableCell: {
    backgroundColor: 'transparent'
  },
  tableRow: {
    '&:hover': {
      backgroundColor: `rgba(250, 250, 250)`
    }
  }
}));

/**
 * Renders the list of users for the admin screen.
 */
const AdminUsers: React.FC<AdminUsersProps> = (props: AdminUsersProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const {
    addUser,
    retrievalStatus,
    users
  } = useRetrieveUsersList();

  /**
   * Updates the list of users with the latest one.
   *
   * @param { PrivateProfile } user - the new user to be added.
   */
  const updateUsers: (
    user: PrivateProfile
  ) => void = (
    user: PrivateProfile
  ): void => {
    addUser(user);
  }

  /**
   * Displays the create new account overlay.
   */
  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid
          alignItems='center'
          container
          className={clsx(classes.toolbar)}
          justify='space-between'
        >
          <Grid item>
            Filter options
          </Grid>
          <Grid item>
            <CreateUser 
              update={updateUsers}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {users.length > 0 &&
          <Paper>
            <TableContainer className={clsx(classes.tableContainer)}>
              <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={clsx(classes.headerCell)}>
                        Handle
                      </TableCell>
                      <TableCell align='right' className={clsx(classes.headerCell)}>
                        Raves
                      </TableCell>
                      <TableCell align='right' className={clsx(classes.headerCell)}>
                        Followers
                      </TableCell>
                    </TableRow>
                  </TableHead>
                <TableBody>
                  {users.map((user: PrivateProfile) => {
                    return (
                      <TableRow key={user._id} className={clsx(classes.tableRow)}>
                        <TableCell component='th' scope='row' className={clsx(classes.tableCell)}>
                          {user.handle}
                        </TableCell>
                        <TableCell align='right' className={clsx(classes.tableCell)}>
                          {user.statistics ? user.statistics.ravesCount : 'N/A'}
                        </TableCell>
                        <TableCell align='right' className={clsx(classes.tableCell)}>
                          {user.statistics ? user.statistics.followers : 'N/A'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        }
      </Grid>
    </Grid>
  );
}

export default withRouter(AdminUsers);

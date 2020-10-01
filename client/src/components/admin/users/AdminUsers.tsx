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
    maxHeight: `calc(100vh - 250px)`
  },
  headerCell: {
    backgroundColor: `#F1F1F1`,
    borderBottom: `1px solid rgba(200,200,200)`,
    fontWeight: 800,
    textTransform: 'uppercase'
  },
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
    retrievalStatus,
    users
  } = useRetrieveUsersList();

  return (
    <Grid container>
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
                      <TableRow key={user._id}>
                        <TableCell component='th' scope='row'>
                          {user.handle}
                        </TableCell>
                        <TableCell align='right'>
                          {user.statistics ? user.statistics.ravesCount : 'N/A'}
                        </TableCell>
                        <TableCell align='right'>
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

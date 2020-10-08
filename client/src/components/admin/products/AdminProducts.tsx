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
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
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
import AdminProductRow from './AdminProductRow';

// Enumerators.
import { SortDirection } from '../Sort.enum';

// Hooks.
import { useRetrieveProductsList } from './useRetrieveProductsList.hook';

// Interfaces.
import { AdminProductsProps } from './AdminProducts.interface';
import { Product } from '../../product/Product.interface';

/**
 * Create styles for the admin products screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  tableContainer: {
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
 * Renders the list of products for the admin screen.
 */
const AdminProducts: React.FC<AdminProductsProps> = (props: AdminProductsProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const {
    retrievalStatus,
    products,
    updateProductInList
  } = useRetrieveProductsList({
    sort: {
      created: SortDirection.DESCENDING
    }
  });

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
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {products.length > 0 &&
          <Paper>
            <TableContainer className={clsx(classes.tableContainer)}>
              <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className={clsx(classes.headerCell)}>
                        Brand
                      </TableCell>
                      <TableCell className={clsx(classes.headerCell)}>
                        Product Name
                      </TableCell>
                      <TableCell className={clsx(classes.headerCell)}>
                        Product Type
                      </TableCell>
                      <TableCell align='right' className={clsx(classes.headerCell)}>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                <TableBody>
                  {products.map((product: Product, index: number) => (
                    <AdminProductRow
                      index={index}
                      key={product._id}
                      product={{...product}}
                      update={updateProductInList}
                    />                  
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        }
      </Grid>
    </Grid>
  );
}

export default withRouter(AdminProducts);

/**
 * BrandSelectList.tsx.
 * Component for selecting a brand from a display list.
 */

// Modules.
import * as React from 'react';
import Box from '@material-ui/core/List';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import Zoom from '@material-ui/core/Zoom';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { CategoryItem } from '../../category/Category.interface';
import { Brand } from '../Brand.interface';
import { BrandSelectListProps } from './BrandSelectList.interface';

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  backgroundContainer: {
    backgroundColor: 'rgba(100, 106, 240, 0.1)',
    borderRadius: theme.shape.borderRadius,
    marginTop: '0.5rem'
  },
  container: {
    height: '100%'
  },
  list: {
    padding: '0.1rem 1rem'
  },
  listItem: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: `0 1px 1px rgba(100,106,240, 0.25)`,
    paddingBottom: '.5rem',
    paddingTop: '.5rem',
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.common.white
    }
  },
  listBox: {
    flexDirection: 'column'
  },
  productBrand: {
    fontSize: '.9rem',
    fontWeight: 500
  },
  productName: {
    fontSize: '1.15rem',
    fontWeight: 500
  },
  cateogryName: {
    fontWeight: 400
  }
}));

/**
 * Assists the user in the selection of a brand.
 */
const BrandSelectList: React.FC<BrandSelectListProps> = (props: BrandSelectListProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Use the custom styles.
  const classes = useStyles();

  /**
   * Performs the brand selection.
   *
   * @param { string } id - the product id.
   */
  const selectBrand: (
    index: number
  ) => void = (
    index: number
  ): void => {

    const brand: Brand = {...props.brands[index]};

    // Create the event object from the provided values.
    const eventData: EventObject = {
      'brand name': brand.name,
      'brand id': brand._id,
    };

    analytics.trackEvent(`select existing brand`)(eventData);

    props.select(brand);
  }

  return (
    <Grid
      className={classes.container}
      container
      alignItems='stretch'
    >
      <Fade in={props.brands && props.brands.length > 0}>
        <Grid item xs={12} className={classes.backgroundContainer}>
          {props.brands && props.brands.length > 0 &&
            <Grow in={props.brands.length > 0}>
              <List className={classes.list}>
                {props.brands.map((brand: Brand, index: number) => {
                  const added: boolean = true;
                  return (
                    <Zoom 
                      in={added}
                      style={{transitionDelay: added ? `${100 * index}ms`: `100ms`}}
                      key={brand._id}
                    >
                      <ListItem
                        button
                        className={classes.listItem}
                        disableRipple
                        onClick={() => selectBrand(index)}
                      >
                        <Box component='div'>
                          <Typography variant='body1' color='textPrimary' className={classes.productName}>
                            {brand.name}
                          </Typography>
                        </Box>
                      </ListItem>
                    </Zoom>
                  )
                })}
              </List>
            </Grow>
          }
        </Grid>
      </Fade>
    </Grid>
  )
}

export default BrandSelectList;

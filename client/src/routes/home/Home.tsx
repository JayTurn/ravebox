/**
 * Home.tsx
 * Home screen route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import API from '../../utils/api/Api.model';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  updateListByCategory,
  updateListByProduct
} from '../../store/review/Actions';

// Components.
import Logo from '../../components/logo/Logo';
import ListByQuery from '../../components/review/listByQuery/ListByQuery';
import ListTitle from '../../components/elements/listTitle/ListTitle';

// Enumerators.
import {
  PresentationType,
  ReviewListType
} from '../../components/review/listByQuery/ListByQuery.enum';

// Hooks.
import {
  useRetrieveListByQuery
} from '../../components/review/listByQuery/useRetrieveListsByQuery.hook';

// Interfaces.
import { HomeProps } from './Home.interface';
import { ReviewGroup } from '../../components/review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerPadding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    introContainer: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(4, 2, 4),
    },
    introContainerLarge: {
      padding: theme.spacing(8, 2, 12)
    },
    introText: {
      color: theme.palette.text.secondary,
      fontSize: '2rem',
      fontWeight: 300,
      marginTop: theme.spacing(4),
      textAlign: 'center'
    },
    introTextLarge: {
      fontSize: '2.5rem'
    }
  })
);

/**
 * Home route component.
 */
const Home: React.FC<HomeProps> = (props: HomeProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    retrievalStatus
  } = useRetrieveListByQuery({
    queries: ['computers', 'kitchen_and_dining'],
    listType: ReviewListType.CATEGORY,
    update: props.updateListByCategory
  });

  /**
   * Render the home route component.
   */
  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} className={clsx(
          classes.introContainer,
          {
            [classes.introContainerLarge]: largeScreen
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12}>
            <Logo
              fullWidth={largeScreen ? '270px' : '200px'}
              iconOnly={false}
            /> 
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h1' className={clsx(
                classes.introText,
                {
                  [classes.introTextLarge]: largeScreen
                }
              )}
            >
              Everything reviewed, two minutes or less.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup['computers'] &&
          <ListByQuery
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup['computers']}
            title={
              <ListTitle
                title={`Tech raves`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup['kitchen_and_dining'] &&
          <ListByQuery
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup['kitchen_and_dining']}
            title={
              <ListTitle
                title={`Health & Beauty raves`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
    </Grid>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: any, ownProps: HomeProps) {
  const categoryGroup: ReviewGroup | undefined = state.review ? state.review.listByCategory : undefined;
  return {
    ...ownProps,
    categoryGroup
  };
}

/**
 * Map dispatch actions to the home route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateListByCategory,
      updateListByProduct
    },
    dispatch
  );

export default connect(
    mapStatetoProps,
    mapDispatchToProps
  )(Home);

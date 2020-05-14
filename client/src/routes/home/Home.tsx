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
import LinkElement from '../../components/elements/link/Link';
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
import { StyleType } from '../../components/elements/link/Link.enum';

// Hooks.
import {
  useRetrieveListByQuery
} from '../../components/review/listByQuery/useRetrieveListsByQuery.hook';

// Interfaces.
import { Category, CategoryItem } from '../../components/category/Category.interface';
import { HomeProps } from './Home.interface';
import { ReviewGroup } from '../../components/review/Review.interface';

// Retrieve the list of categories.
const categoryList: Array<Category> = require('../../components/category/categories.json').ontology;

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    aboutContainer: {
      backgroundColor: theme.palette.secondary.dark,
      padding: theme.spacing(4, 2, 4),
    },
    aboutContainerLarge: {
      padding: theme.spacing(8, 2, 12)
    },
    aboutText: {
      color: theme.palette.common.white,
      fontSize: '2rem',
      fontWeight: 400,
      marginBottom: theme.spacing(6),
      marginTop: theme.spacing(6),
      textAlign: 'center',
      textShadow: `0 1px 1px rgba(0,32,27,0.2)`
    },
    aboutTextLarge: {
      fontSize: '2.5rem'
    },
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
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    introTextLarge: {
      fontSize: '2.5rem'
    }
  })
);

/**
 * Retrieves the top level product categories.
 *
 * @return Array<string>
 */
const getTopLevelCategories: (
  list: Array<Category>
) => Array<string> = (
  list: Array<Category>
): Array<string> => {
  const categories: Array<string> = [];

  // Loop through the list of categories and add the top level items to the
  // array.
  let i: number = 0;

  do {
    const current: Category = list[i];
    categories.push(current.key);
    i++;
  } while (i < list.length);

  return categories;
}

/**
 * Home route component.
 */
const Home: React.FC<HomeProps> = (props: HomeProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm')),
        queries: Array<string> = getTopLevelCategories(categoryList); 

  const {
    retrievalStatus
  } = useRetrieveListByQuery({
    queries: queries,
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
              Everything reviewed in 2 minutes or less.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinkElement
              path={'/product/add'}
              styleType={StyleType.BUTTON_PRIMARY}
              title='Post a rave'
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup[queries[0]] &&
          <ListByQuery
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup[queries[0]]}
            title={
              <ListTitle
                title={`${categoryList[0].label} raves`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup[queries[1]] &&
          <ListByQuery
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup[queries[1]]}
            title={
              <ListTitle
                title={`${categoryList[0].label} raves`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
      <Grid item xs={12} className={clsx(
          classes.aboutContainer,
          {
            [classes.aboutContainerLarge]: largeScreen
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12} md={9}>
            <Typography variant='h2' className={clsx(
                classes.aboutText,
                {
                  [classes.aboutTextLarge]: largeScreen
                }
              )}
            >
              A way to discover products and share your experiences with the world.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinkElement
              path={'/about'}
              styleType={StyleType.BUTTON_SECONDARY_INVERSE}
              title='About ravebox'
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup[queries[2]] &&
          <ListByQuery
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup[queries[2]]}
            title={
              <ListTitle
                title={`${categoryList[2].label} raves`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup[queries[3]] &&
          <ListByQuery
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup[queries[3]]}
            title={
              <ListTitle
                title={`${categoryList[3].label} raves`}
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

/**
 * Category.tsx
 * Category screen route component.
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
import { withRouter } from 'react-router';

// Actions.
import {
  updateListByCategory,
  updateListByProduct
} from '../../store/review/Actions';

// Components.
import ListByQuery from '../../components/review/listByQuery/ListByQuery';
import ListTitle from '../../components/elements/listTitle/ListTitle';
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Enumerators.
import {
  PresentationType,
  ReviewListType
} from '../../components/review/listByQuery/ListByQuery.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';
import { StyleType } from '../../components/elements/link/Link.enum';

// Hooks.
import {
  useRetrieveListByQuery
} from '../../components/review/listByQuery/useRetrieveListsByQuery.hook';

// Interfaces.
import { Category, CategoryItem } from '../../components/category/Category.interface';
import {
  CategoryListProps
} from './CategoryList.interface';
import { ReviewGroup } from '../../components/review/Review.interface';
import {
  RetrieveListByQueryParams,
  RetrieveListByQueryResponse
} from '../../components/review/listByQuery/ListByQuery.interface';

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
 * Retrieves the category based on the provided category key.
 *
 * @return Array<string>
 */
const getCategory: (
  categoryKey: string
) => (
  list: Array<Category>
) => Category | null = (
  categoryKey: string
) => (
  list: Array<Category>
): Category | null => {
  let category: Category | null = null;

  // Loop through the list of categories and add the top level items to the
  // array.
  let i: number = 0;

  // Loop through the top level categories to retrieve the subcategories.
  do {
    const current: Category = list[i];

    if (current.key !== categoryKey || !current.children) {
      i++;
      continue;
    }

    category = {...current};
    break;

  } while (i < list.length);

  return category;
}

/**
 * Retrieves a list of sub-categories as an array of strings.
 *
 * @param { Category } category - the category object.
 *
 * @return Array<string>
 */
const getSubCategoryQueries: (
  category: Category
) => Array<string> = (
  category: Category
): Array<string> => {
  const subCategories: Array<string> = [];

  if (!category || !category.children) {
    return subCategories;
  }

  let i: number = 0;

  do {
    const current: Category = category.children[i];
    subCategories.push(current.key);

    i++;

  } while (i < category.children.length);

  return subCategories;
}

/**
 * Loads the product category lists from the api before rendering.
 * 
 * @param { CategoryProps } props - the category properties.
 */
const frontloadCategoryList = async (props: CategoryListProps) => {

  /*
  // Retrieve the request parameters.
  const { category } = {...props.match.params};

  const topLevelCategory: Category | null = getCategory(category)(categoryList);

  if (!topLevelCategory) {
    return;
  }

  const values: Array<string> = getSubCategoryQueries(topLevelCategory);

  await API.requestAPI<RetrieveListByQueryResponse>(`review/list/category`, {
    method: RequestType.POST,
    body: JSON.stringify({
      queries: values
    })
  })
  .then((response: RetrieveListByQueryResponse) => {
    if (props.updateListByCategory) {
      props.updateListByCategory({...response.reviews});
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
  */

};

/**
 * Category list route component.
 */
const CategoryList: React.FC<CategoryListProps> = (props: CategoryListProps) => {

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const [category, setCategory] = React.useState<Category | null>(null),
        [queries, setQueries] = React.useState<Array<string>>([]);

  const {
    listStatus
  } = useRetrieveListByQuery({
    queries: queries,
    listType: ReviewListType.CATEGORY,
    update: props.updateListByCategory
  });

  React.useEffect(() => {
    const categoryKey: string = props.match.params.category;

    if (!category || category.key !== categoryKey) {
      const current: Category | null = getCategory(categoryKey)(categoryList);

      if (current) {
        setCategory({...current});
        setQueries([...getSubCategoryQueries(current)]);
      }
    }
  }, [props.match.params, queries, category])


  /**
   * Render the home route component.
   */
  return (
    <Grid
      container
      direction='column'
    >
      {category &&
        <PageTitle title={`${category.label}`} />
      }
      {props.categoryGroup && category &&
        <React.Fragment>
          {
            queries.map((query: string, index: number) => {
              return (
                <React.Fragment>
                  {props.categoryGroup && props.categoryGroup[query] && category.children &&
                    <ListByQuery
                      listType={ReviewListType.CATEGORY}
                      presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
                      reviews={props.categoryGroup[query]}
                      title={
                        <ListTitle
                          title={`${category.children[index].label} raves`}
                          url={`/categories/${categoryList[index].key}`}
                          presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
                        />
                      }
                    />
                  }
                </React.Fragment>
              )
            })
          }
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map the redux state to the category properties.
 *
 */
const mapStateToProps = (state: any, ownProps: CategoryListProps) => {
  const categoryGroup: ReviewGroup | undefined = state.review ? state.review.listByCategory : undefined;
  return {
    ...ownProps,
    categoryGroup
  };
}

/**
 * Map dispatch actions to the category route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateListByCategory
    },
    dispatch
  );

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadCategoryList,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(CategoryList)
));
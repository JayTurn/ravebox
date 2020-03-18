/**
 * CategorySelection.tsx
 * Category selection component.
 */

// Modules.
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Interfaces.
import { Category } from '../Category.interface';
import { CategorySelectionProps } from './CategorySelection.interface';

// Retrieve the list of categories.
const list: Array<Category> = require('../categories.json').ontology;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      padding: theme.spacing(0.5),
    },
    chip: {
      margin: theme.spacing(0.5),
    },
    selectedChip: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFFFFF',
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
      }
    }
  }),
);

/**
 * Renders the category selection.
 */
const CategorySelection: React.FC<CategorySelectionProps> = (props: CategorySelectionProps) => {
  // Define the category selection classes.
  const classes = useStyles();

  // Define the category selection state.
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(-1),
        [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = React.useState(-1),
        [subCategories, setSubCategories] = React.useState([{
          key: '',
          label: ''
        }]);

  /**
   * Updates the sub categories based on the selected category.
   */
  const selectCategory: (
    index: number
  ) => void = (
    index: number
  ): void => {
    const selectedCategoryList: Array<Category> | undefined = list[index].children,
          selectedCategoryKey: string = list[index].key;

    if (selectedCategoryList) {
      setSubCategories([...selectedCategoryList]);
      setSelectedCategoryIndex(index);
      setSelectedSubCategoryIndex(-1);
      props.update([selectedCategoryKey]);
    }
  }

  /**
   * Invokes the update method when a sub-category is selected.
   *
   * @param { number } index - the sub-category index.
   */
  const selectSubCategory: (
    index: number
  ) => void = (
    index: number
  ): void => {
    const categoryKey: string = list[selectedCategoryIndex].key,
          subCategoryKey: string = subCategories[index].key;

    if (categoryKey && subCategoryKey) {
      setSelectedSubCategoryIndex(index);
      props.update([categoryKey, subCategoryKey]);
    }
  }

  return (
    <Grid
      container
      direction='column'
      spacing={2}
      alignItems='stretch'
    >
      <Grid item xs={12}>
        <Typography variant='h3' gutterBottom>
          Select a category
        </Typography>
        {list.map((category: Category, index: number) => {
          return (
            <Chip
              className={selectedCategoryIndex === index ? classes.selectedChip : classes.chip}
              clickable={true}
              key={category.key}
              label={category.label}
              onClick={(e: React.SyntheticEvent) => selectCategory(index)}
            />
          )
        })}  
      </Grid>
      {selectedCategoryIndex > -1 &&
        <Grid item xs={12} key={selectedCategoryIndex}>
          <Typography variant='h3' gutterBottom>
            Select a sub-category
          </Typography>
          {subCategories.map((subCategory: Category, index: number) => {
            return (
              <Chip
                className={selectedSubCategoryIndex === index ? classes.selectedChip : classes.chip}
                clickable={true}
                key={subCategory.key}
                label={subCategory.label}
                onClick={(e: React.SyntheticEvent) => selectSubCategory(index)}
              />
            )
          })}  
        </Grid>
      }
    </Grid>
  )
}

export default CategorySelection;

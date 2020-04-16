/**
 * CategorySelection.tsx
 * Category selection component.
 */

// Modules.
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Interfaces.
import { Category, CategoryItem } from '../Category.interface';
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
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: `0 0 1px ${theme.palette.grey.A400}`
    },
    selectedChip: {
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 1px ${theme.palette.primary.main}`,
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
          selectedCategory: CategoryItem = {
            key: list[index].key,
            label: list[index].label
          };

    if (selectedCategoryList) {
      setSubCategories([...selectedCategoryList]);
      setSelectedCategoryIndex(index);
      setSelectedSubCategoryIndex(-1);
      props.update([selectedCategory]);
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
    const selectedCategory: CategoryItem = {
            key: list[selectedCategoryIndex].key,
            label: list[selectedCategoryIndex].label
          },
          selectedSubCategory: CategoryItem = {
            key: subCategories[index].key,
            label: subCategories[index].label
          };

    if (selectedCategory && selectedSubCategory) {
      setSelectedSubCategoryIndex(index);
      props.update([selectedCategory, selectedSubCategory]);
    }
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='stretch'
    >
      <Grid item xs={12} md={6} style={{marginBottom: '1.5rem', marginTop: '3rem'}}>
        <Typography variant='h3'>
          Select a product category  
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        {list.map((category: Category, index: number) => {
          return (
            <Chip
              className={clsx(classes.chip,{
                [classes.selectedChip]: selectedCategoryIndex === index
              })}
              clickable={true}
              key={category.key}
              label={category.label}
              onClick={(e: React.SyntheticEvent) => selectCategory(index)}
            />
          )
        })}  
      </Grid>
      {selectedCategoryIndex > -1 &&
        <React.Fragment>
          <Grid item xs={12} key={selectedCategoryIndex} style={{marginBottom: '1.5rem', marginTop: '3rem'}}>
            <Typography variant='h3'>
              Select a product sub-category
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
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
        </React.Fragment>
      }
    </Grid>
  )
}

export default CategorySelection;

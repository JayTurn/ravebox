/**
 * AdminAutoCompleteField.tsx
 * Renders the component displaying fields to be used with autocomplete.
 */

// Modules.
import Box from '@material-ui/core/Box';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import debounce from 'lodash/debounce';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import Input from '../../forms/input/Input';
import StyledButton from '../../elements/buttons/StyledButton';

// Interfaces.
import { AdminAutoCompleteFieldProps } from './AdminAutoCompleteField.interface';
import { InputData } from '../../forms/input/Input.interface';

/**
 * Create styles for the autocomplete field.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  addButton: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    lineHeight: '2.8rem'
  },
  fieldContainer: {
    position: 'relative',
    zIndex: 1
  },
  inputContainer: {
    zIndex: 1
  },
  input: {
    flexGrow: 1
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRight: 'none'
    }
  },
  listItemContainer: {
    padding: theme.spacing(0, 1),
  },
  resultsList: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid rgba(67,74,217, 0.25)`,
    borderRadius: 4,
    boxShadow: `0 1px 3px rgba(100,106,240, 0.25)`,
    padding: theme.spacing(1),
    position: 'absolute',
    left: 0,
    top: 60,
    width: '100%',
    zIndex: 2
  }
}));

/**
 * Renders the autocomplete field.
 */
const AdminAutoCompleteField: React.FC<AdminAutoCompleteFieldProps> = (props: AdminAutoCompleteFieldProps) => {
  // Match the mobile media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Set the search query.
  const [query, setQuery] = React.useState<string>(props.defaultValue)

  // Define the search field form state.
  const [value, setValue] = React.useState<string>(props.defaultValue);

  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Handles updates to the search form.
   *
   * @param { InputData } data - the field data.
   */
  const handleBlur: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
  }

  /**
   * Handles the change event on the search field.
   *
   * @param { React.ChangeEvent } fieldEvent - the react event.
   */
  const handleChange: (
    fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (
    fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {

    const term: string = fieldEvent.target.value;

    setQuery(term);

    props.search(term);

    setOpen(true);
  }

  /**
   * Handles clicking outside the list when it's present.
   */
  const handleClickAway: (
  ) => void = (
  ): void => {
    setOpen(false);
  }

  /**
   * Handles the closing of the popover message.
   */
  const handlePopoverClose: (
  ) => void = (
  ): void => {
    setOpen(false);
    setQuery('');
  }

  /**
   * Handles the selecting of an option.
   *
   * @param { number } index - the index of the selected option.
   */
  const handleSelect: (
    index: number
  ) => void = (
    index: number
  ): void => {
    setQuery(props.options[index]);
    props.select(index);
    setOpen(false);
  }

  /**
   * Handles creating a new brand and navigating to the next step.
   */
  const submit: (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => Promise<void> = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ): Promise<void> => {
    if (props.addNew) {
      props.addNew(query);
      setOpen(false);
    }
  }

  return (
    <Grid container className={clsx(classes.fieldContainer)}>
      <Grid 
        className={clsx(classes.inputContainer)}
        item
        xs={12}
      >
        <Grid container>
          <Grid item className={clsx(classes.input)}>
            <Input
              defaultValue={props.defaultValue}
              handleBlur={handleBlur}
              handleChange={handleChange}
              name='query'
              type='text'
              title={props.fieldTitle}
              value={query}
            />
          </Grid>
        </Grid>
      </Grid>
      {open &&
        <ClickAwayListener onClickAway={handleClickAway}>
          <List className={clsx(classes.resultsList)}>
            {props.options.map((item: string, index: number) => {
              return (
                <ListItem
                  button
                  className={clsx(classes.listItemContainer)}
                  key={index}
                  onClick={() => handleSelect(index)}
                > 
                  <ListItemText>
                    {item}
                  </ListItemText>
                </ListItem>
              );
            })}
            {props.addEnabled &&
              <ListItem
                className={clsx(classes.listItemContainer)}
              > 
                <ListItemText>
                  <Grid
                    container
                    alignItems='center'
                    justify='space-between'
                  >
                    <Grid item>
                      {query}
                    </Grid>
                    <Grid item>
                      <StyledButton
                        clickAction={submit}
                        title='Create new'
                        color='secondary'
                      />
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItem>
            }
          </List>
        </ClickAwayListener>
      }
    </Grid>
  );
}

export default AdminAutoCompleteField;

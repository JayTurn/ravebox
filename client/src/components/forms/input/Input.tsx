/**
 * Input.tsx
 * Input form field component.
 */

// Dependent modules.
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as React from 'react';
import TextField from '@material-ui/core/TextField';

// Dependent interfaces.
import { InputProps } from './Input.interface';

/**
 * Input function component for handling form field inputs.
 */
const Input: React.FC<InputProps> = (props: InputProps) => {
  const [firstTouch, setFirstTouch] = React.useState<boolean>(props.allowAutocomplete || false);

  /**
   * Called for each change event.
   * Note: Should be used sparingly as it can cause render performance issues.
   */
  const handleInputUpdate: (
    fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (
    fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (props.handleChange) {
      props.handleChange(fieldEvent);
    }
    if (firstTouch) {
      props.handleBlur({
        key: props.name,
        value: fieldEvent.target.value
      });
      setFirstTouch(false);
    }
  }

  /**
   * Called when focus is removed from the input field.
   */
  const updateValues: (
    fieldEvent: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (
    fieldEvent: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    props.handleBlur({
      key: props.name,
      value: fieldEvent.target.value
    });
  }

  let message = props.helperText;

  if (props.validation && props.validation.errorMessage) {
    message = props.validation.errorMessage 
  }

  return (
    <TextField
      autoFocus={props.autoFocus}
      className={props.className}
      defaultValue={props.defaultValue}
      error={props.validation && props.validation.errorMessage !== ''}
      fullWidth={true}
      helperText={message}
      id={props.id || props.name}
      InputProps={{
        startAdornment: props.prefix ? <InputAdornment position='start'>{props.prefix}</InputAdornment> : ''
      }}
      label={props.title}
      multiline={props.multiline}
      onChange={handleInputUpdate}
      onBlur={updateValues}
      onFocus={props.handleFocus}
      required={props.required}
      rows={props.rows}
      rowsMax={props.rowsMax}
      type={props.type}
      variant='outlined'
      value={props.value}
    />
  );
};

export default Input;


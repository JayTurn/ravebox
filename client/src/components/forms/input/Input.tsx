/**
 * Input.tsx
 * Input form field component.
 */

// Dependent modules.
import * as React from 'react';
import TextField from '@material-ui/core/TextField';

// Dependent interfaces.
import { InputProps } from './Input.interface';

/**
 * Input function component for handling form field inputs.
 */
const Input: React.FC<InputProps> = (props: InputProps) => {

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
      defaultValue={props.defaultValue}
      error={props.validation && props.validation.errorMessage !== ''}
      fullWidth={true}
      helperText={message}
      id={props.name}
      label={props.title}
      onChange={handleInputUpdate}
      onBlur={updateValues}
      onFocus={props.handleFocus}
      required={props.required}
      type={props.type}
      variant='outlined'
      value={props.value}
    />
  );
};

export default Input;


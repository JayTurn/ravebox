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
   * Called when updates to the input field are performed.
   */
  const updateValues: (
    fieldEvent: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (
    fieldEvent: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    props.handleChange({
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
      error={props.validation && props.validation.errorMessage !== ''}
      fullWidth={true}
      helperText={message}
      id={props.name}
      label={props.title}
      onBlur={updateValues}
      required={props.required}
      type={props.type}
      variant='outlined'
    />
  );
};

export default Input;


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

  return (
    <div className={`form-group ${props.hasError}`}>
      <TextField
        fullWidth={true}
        helperText={props.description}
        id={props.name}
        label={props.title}
        onBlur={updateValues}
        required={props.required}
        type={props.type}
      />
    </div>
  );
};

export default Input;


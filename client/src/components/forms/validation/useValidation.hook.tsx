/**
 * useValidation.hook.ts
 * Custom hook for validating forms.
 */

// Modules.
import * as React from 'react';

// Interfaces.
import {
  ValidationHook
} from './Validation.interface';

/**
 * Checks if the validation type is a promise.
 */
const isPromise = (
  validation: string | Promise<string>
): validation is Promise<string> => {
  if (typeof (validation as Promise<string>).then === 'function') {
    return true;
  } else {
    return false;
  }
}


export function useValidation(params: ValidationHook) {

  const [validation, setValidation] = React.useState({...params.validation});

  /** 
   * Validates a field using the rules provided.
   *
   */
  const validateField: (
    name: string
  ) => (
    value: string
  ) => Promise<string> = (
    name: string
  ) => async (
    value: string
  ): Promise<string> => {
    let i: number = 0;
    do {
      // Declare the message to be returned.
      let message: string = '';

      // Trigger the validation function.
      const invalid: string | Promise<string> = validation[name].rules[i]({
        key: name,
        value
      });


      // If this validation function is a promise, we must wait for it to
      // resolve.
      if (isPromise(invalid)) {
        message = await invalid;
      } else {
        message = invalid;
      }

      // Update the validation state with the results from this rule.
      validation[name] = {...validation[name], errorMessage: message};
      setValidation({...validation});

      // If we have an error message, avoid triggering additional validation
      // rules and return the current error.
      if (message) {
        return message;
      }

      i++
    } while (i < validation[name].rules.length);

    // We haven't found any errors so return an empty string.
    return '';
  };

  /**
   * Validates the entire list of fields and sets the errors.
   */
  const validateAllFields: (
    fields: Record<string, string>
  ) => Promise<Array<string>> = async (
    fields: Record<string, string>
  ): Promise<Array<string>> => {
    const errorMessages: Array<string> = [];
    
    let i: number = 0;

    const keys: Array<string> = Object.keys(validation);

      do {
        const key: string = keys[i];

        if (fields.hasOwnProperty(key)) {
          
          let message: string = '';
          const invalid: string | Promise<string> = validateField(key)(fields[key]);

          if (isPromise(invalid)) {
            message = await invalid;
          } else {
            message = invalid;
          }

          if (message) {
            if (validation[key].errorMessage) {
              errorMessages.push(validation[key].errorMessage); 
            }
          }
        }

        i++
      } while (i < keys.length);

      return errorMessages;
    }

  return {
    validation,
    validateField,
    validateAllFields
  }
}

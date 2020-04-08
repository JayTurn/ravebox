/**
 * ValidationRules.tsx
 */

// Modules.
import API from '../../../utils/api/Api.model';

// Interfaces.
import { InputData } from '../input/Input.interface';
import { HandleAvailableResponse } from './Validation.interface';

/**
 * Validates the presence of a value.
 *
 * @param { Validate } validate - the object to be validated.
 */
export const isRequired: (
  data: InputData
) => string = (
  data: InputData
): string => {
  let message: string = '';
  if (!data.value) {
    message = `The ${data.key} field is required`;
  }
  return message;
}

/**
 * Validates the value is an email.
 *
 * @param { InputData } data - the value to be validated.
 */
export const isEmail: (
  data: InputData
) => string = (
  data: InputData
): string => {
  let message: string = '';

  // Get the index of the @ symbol and confirm we have at least one
  // character before it and a domain afterwards. 
  const email: string = data.value;
  const atIndex: number = email.indexOf('@');

  if (atIndex < 0) {
    return `The email address must contain an @ symbol`;
  }

  if (atIndex === 0) {
    return `An email address musn't begin with an @ symbol`;
  }

  if (atIndex === email.length - 1) {
    return `Your email address must contain a domain name. For example: gmail.com`;
  }

  const domain: string = email.split('@')[1];

  if (!domain) {
    return `Your email address must contain a domain name. For example: gmail.com`;
  }

  const dotIndex: number = domain.indexOf('.');

  if (dotIndex < 0) {
    return `Your email address must end with a domain extension. For example: .com or .org`;
  }

  if (dotIndex === domain.length - 1) {
    return `Your email address can't end with a period`;
  }

  return message;
}

/**
 * Validates the value is a valid password.
 *
 * @param { InputData } data - the value to be validated.
 */
export const isPassword: (
  data: InputData
) => string = (
  data: InputData
): string => {
  let message: string = '';

  // Get the password.
  const password: string = data.value;

  // Determine the password is at least 6 characters in length.
  if (password.length < 8) {
    return `Your password must be at least 8 characters long`;
  }

  const alphabetic = (/[A-Z]/.test(password));

  if (!alphabetic) {
    return `Your password must contain at least one uppercase character`;
  }

  const numeric = (/[0-9]/.test(password));

  if (!numeric) {
    return 'Your password must contain at least one number'
  }

  const special = (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password));

  if (!special) {
    return `Your password must contain at least one special character`;
  }

  return message;
}

/**
 * Validates the user handle is available.
 *
 * @param { InputData } data - the value to be validated.
 */
export const handleAvailable: (
  data: InputData
) => Promise<string> = async (
  data: InputData
): Promise<string> => {

  return await new Promise<string>((resolve: Function, reject: Function) => {
    const handle: string = data.value;

    let message: string = '';

    API.requestAPI<HandleAvailableResponse>(`user/handle/${handle}`, {
      method: 'GET',
    })
    .then((response: HandleAvailableResponse) => {

      if (response.errorCode) {
        message = response.title;
      }

      resolve(message);
    })
    .catch((error: Error) => {
      resolve(error.name);
    });
  });

}

/**
 * Validates the value only contains allowed characters.
 *
 * @param { InputData } data - the value to be validated.
 */
export const allowedCharacters: (
  allowed: RegExp
) => (
  data: InputData
) => string = (
  allowed: RegExp
) => (
  data: InputData
): string => {
  let message: string = '';

  // Get the handle.
  const handle: string = data.value;

  const acceptedCharacters = (allowed.test(handle));

  if (!acceptedCharacters) {
    return `Your handle may only contain alphanumeric characters (a-z, A-Z, 0-9), underscores (_) and hyphens (-)`;
  }

  return message;
}

/**
 * Validates the minimum character length.
 *
 * @param { Validate } validate - the object to be validated.
 */
export const minLength: (
  min: number
) => (
  data: InputData
) => string = (
  min: number
) => (
  data: InputData
): string => {
  let message: string = '';

  // Only validate the minimum number of characters if we have a value.
  if (!data.value || data.value.length < min) {
    return `The ${data.key} must be at least ${min} characters in length`
  }

  return message;
}

/**
 * Validates the latitude and longitude values.
 *
 * @param { Validate } validate - the object to be validated.
 */
export const minMax: (
  min: number
) => (
  max: number
) => (
  data: InputData
) => string = (
  min: number
) => (
  max: number
) => (
  data: InputData
): string => {
  let message: string = '';

  // Only validate the min and max rules if we have a value.
  if (data.value) {
    const value: number = +data.value;

    if (value > max || value < min) {
      message = `The ${data.key} must be between ${min} and ${max}`;
    }
  }

  return message;
}

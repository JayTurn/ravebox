/**
 * connect.model.js
 * The database connection interface.
 */
'use strict';

// Modules.
import * as _ from 'lodash';

// Interfaces.
import {
  ResponseObject,
  ResponseError
} from './connect.interface';

export default class Connect {

  /**
   * Setting response with code and message.
   *
   * @param {object} responseObject
   * Response object to populate.
   *
   * @param {int} code
   * Status code for response, e.g. 200, 403.
   *
   * @param {string} title
   * Reponse title.
   *
   * @return {object}
   */
  static setResponse(responseObject: ResponseObject, code: number, title: string): ResponseObject {
    // Set the status.
    responseObject.status = code;

    // If the data property isn't defined.
    if (_.isUndefined(responseObject.data)) {
      // Create a new object.data property.
      responseObject.data = {};
    }

    // Set the object data message.
    responseObject.data.title = title || '';

    return responseObject;
  }

  /**
   * Static method to define a validation message.
   *
   * @param {object} error
   * The error object returned from the Mongoose model.
   *
   * @return {object}
   */
  static setValidationResponse(error: ResponseError | Error): ResponseObject {
    // Declare the variables needed for the response with defaults.
    const responseObject: ResponseObject = {
          data: {
            errorCode: 'UNKNOWN_VALIDATION_ERROR',
            message: 'Please try to sign up again',
          }
        };
    let code = 400,
        title = 'Something was wrong with your submission';

    // Check that errors exist in the error object.
    if ((error as ResponseError).errors) {
      // Get the error key.
      const keys: Array<string> = Object.keys((error as ResponseError).errors);

      //const first: string = keys[0];

      // Set the error code.
      responseObject.data.errorCode = keys[0];

      // We'll only use the first error as we should only ever register a
      // single error due to the synchronous approach to Mongoose validation
      // we are using with models.
      switch (keys[0]) {
        // For each case, set the validation message matched to the message.
        case 'EMAIL_ALREADY_REGISTERED':
          code = 409;
          title = 'This email is already registered';
          responseObject.data.message = 'Please sign up with a different email';
          break;
        case 'EMAIL_EMPTY':
          title = 'The email was not provided';
          responseObject.data.message = 'Please provide an email address';
          break;
        default:
          break;
      }
    }

    // Return the setResponse formatted message.
    return Connect.setResponse(responseObject, code, title);
  }
}

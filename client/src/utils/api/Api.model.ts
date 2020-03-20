/**
 * api.ts
 * Handles api requests.
 */

// Import the dependent interfaces.
import { RequestInterface } from './Api.interface';
import fetch from 'isomorphic-fetch';

/**
 * Wrapper class to manage api requests.
 * @class API
 */
export default class API {

  /**
   * Static method to return the server API path.
   * @method getServerPath
   *
   * @return string
   */
  public static getServerPath(): string {
    return process.env.RAZZLE_API_URI || '';
  }

  /**
   * Static method to return the public path.
   * @method getPublicPath
   *
   * @return string
   */
  public static getPublicUri(): string {
    return process.env.REACT_APP_PUBLIC_URI || '';
  }

  /**
   * Static method for appending the api key query parameter.
   * @method appendAPIKey
   */
  public static appendAPIKey(): string {
    return `?api_key=${process.env.REACT_APP_API_KEY}`;
  }

  /**
   * Converts a response to JSON data.
   * @method getJSON
   *
   * @param { Response } response - the response object.
   *
   * @return Promise<T>
   */
  public static getJSON<T>(response: Response): Promise<T> {
    // Return the JSON response.
    return response.json();
  }

  /**
   * Sets default header properties for requests.
   * @method setDefaultHeaders
   *
   * @return RequestInit
   */
  public static setDefaultHeaders(): RequestInit {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      method: 'GET'
    };
  }

  /**
   * Performs a request to the server api.
   * @method request
   *
   * @param { string } path - the api path to be requested.
   * @param { object } data - data to be submitted with post requests.
   *
   * @return Promise<T>
   */
  public static async requestAPI<T>(path: string, data?: RequestInit): Promise<T> {

    // If we have data, we need to merge the defaults with the provided data
    // arguments.
    if (data) {
      data.headers = {
        ...data.headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      data.credentials = 'include';
    } else {
      data = API.setDefaultHeaders();
    }

    // Define the api path to be requested.
    path = `${API.getServerPath()}${path}`;

    console.log('DATA', data);
    // Perform the fetch of the data.
    return fetch(path, data)
      .then(API.getJSON)
      .then((data: any) => {
        // Return the data in the generic form requested.
        return data as T;
      });
  }

  /**
   * Provides a request wrapper supporting the cancellation of promise streams.
   * @method request
   *
   * @param { Promise<T>} promise - the generic promise.
   *
   * @return RequestInterface<T>
   */
  public static request<T>(promise: Promise<T>): RequestInterface<T>  {
    // Define the cancellation flag used for determining which promise
    // resolution is used.
    let hasCanceled = false;

    // Return the RequestInterface object with a promise property and cancel
    // function.
    return {
      promise: new Promise((resolve: Function, reject: Function) => {
        promise.then(
          (val: T) => {
            // If cancellation flag has been set to true, we should reject the
            // request. The request rejection ensures a setState operation
            // isn't fired after a component has been unmounted.
            hasCanceled ? reject({isCanceled: true}) : resolve(val);
          },
          (error: {}) => {
            // @Todo: Introduce an error model to handle errors and submit
            // logs.
            hasCanceled ? reject({isCanceled: true}) : reject(error);
          }
        );
      }),
      cancel() {
        // Updates the cancellation flag to prevent promises being resolved.
        // With this flag, the promise will be rejected.
        hasCanceled = true;
      }
    };
  }
}

/**
 * Api.interface.ts
 * Interface for API promise requests.
 */
'use strict';

/**
 * Request interface.
 */
export interface RequestInterface<T> {
  promise: Promise<T>;
  cancel: Function;
}

/**
 * API Configuration.
 */
export interface APIImageConfig {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: Array<string>;
    logo_sizes: Array<string>;
    poster_sizes: Array<string>;
    profile_sizes: Array<string>;
    still_sizes: Array<string>;
  };
  change_keys: Array<string>;
  error?: Error;
}

/**
 * API response.
 */
export interface APIResponse {
  title: string;
  errorCode?: string;
}

/**
 * Api.enum
 * Enumerators for API requests.
 */

/**
 * Request type.
 */
export enum RequestType {
  DELETE = 'DELETE',
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST'
}

/**
 * Request retrieval status.
 */
export enum RetrievalStatus {
  FAILED = 'failed',
  NOT_FOUND = 'not_found',
  REQUESTED = 'requested',
  SUCCESS = 'success',
  WAITING = 'waiting'
}


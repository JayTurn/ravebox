/**
 * Interfaces for the connect model.
 */

// Response object interface.
export interface ResponseObject {
  data: Record<string, {}>;
  error?: Error;
  status?: number;
}

export interface ResponseError {
  errors: Array<Record<string, ErrorItem>>;
}

export interface ErrorItem {
  message: string;
}

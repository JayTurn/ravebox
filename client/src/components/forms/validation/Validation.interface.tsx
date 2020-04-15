/**
 * Validation.interface.tsx
 *
 * Interfaces for validation.
 */

// Interfaces.
import { InputData } from '../input/Input.interface';
import { APIResponse } from '../../../utils/api/Api.interface';

export type Validation = (value: InputData) => string;
export type ValidationPromise = (value: InputData) => Promise<string>;

export interface ValidationRules {
  errorMessage: string;
  rules: Array<Validation | ValidationPromise>;
}

export interface ValidationHook {
  validation: ValidationSchema;
}

export type ValidationSchema = Record<string, ValidationRules>;

export type ValidationValues = Record<string, string | boolean>;

/**
 * User handle check response.
 */
export interface HandleAvailableResponse extends APIResponse {
}

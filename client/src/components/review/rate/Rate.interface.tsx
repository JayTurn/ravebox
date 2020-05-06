/**
 * Rate.interface.tsx
 * Interfaces for the review rating component.
 */

// Enumerators.
import { Rating } from './Rate.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';

/**
 * Properties for the review rating component.
 */
export interface RateProps {
  allowed: boolean;
  reviewId: string;
  token: string;
}

/**
 * Rating properties.
 */
export interface RatingResults {
  up: string;
  down: string;
  userRating?: Rating;
}

/*
 * Rating submission response interface.
 */
export interface RatingResponse extends APIResponse {
  results: RatingResults;  
}

/**
 * Parameters for the rating hook.
 */
export interface RatingParams {
  reviewId: string;
}

/**
 * Generate token response interface.
 */
export interface RatingTokenResponse extends APIResponse {
  token: string;
}

/**
 * Parameters for the rate hook.
 */
export interface RatingTokenParams {
  xsrf?: string;
}


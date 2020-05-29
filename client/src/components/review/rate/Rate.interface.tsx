/**
 * Rate.interface.tsx
 * Interfaces for the review rating component.
 */

// Enumerators.
import { Rating } from './Rate.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Review } from '../Review.interface';

/**
 * Properties for the review rating component.
 */
export interface RateProps {
  acceptance: RatingAcceptance;
  review: Review;
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
 * Paramters for the rating data.
 */
export interface RatingAcceptance {
  allowed: boolean;
  played: number;
  playedSeconds: number;
  videoDuration: number;
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


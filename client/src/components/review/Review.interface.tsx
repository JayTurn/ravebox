/**
 * Review.interface.tsx
 * Interfaces for the reviews.
 */

// Enumerators.
import { Recommended } from './recommendation/Recommendation.enum';
import {
  VideoType,
  Workflow
} from './Review.enum';

// Interfaces.
import { Product } from '../product/Product.interface';
import { PublicProfile } from '../user/User.interface';

/**
 * Review interface.
 */
export interface Review {
  created: Date;
  description?: string;
  endTime: number;
  _id: string;
  links: Array<ReviewLink>;
  product?: Product;
  recommended: Recommended;
  sponsored: boolean;
  statistics?: ReviewStatistics;
  startTime: number;
  thumbnail?: string;
  title: string;
  url: string;
  user?: PublicProfile;
  videoHeight?: number;
  videoType: VideoType;
  videoURL?: string;
  videoWidth?: number;
}

/**
 * Interface for groups of review lists.
 */
export type ReviewGroup = Record<string, Array<Review>>;

/**
 * Interface for lists of reviews with titles.
 */
export interface ReviewList {
  id: string;
  title: string;
  reviews: Array<Review>;
  url: string;
}

/**
 * Private review interface.
 */
export interface PrivateReview extends Review {
  published: Workflow;
}

/**
 * Response from the api when requesting a review.
 */
export interface ReviewResponse {
  review: Review;
}

/**
 * Response from the api when requesting a list of reviews.
 */
export interface ReviewsResponse {
  reviews: Array<Review>;
}

/**
 * Review statisctics.
 */
export interface ReviewStatistics {
  ratings: {
    up: number;
    down: number;
  };
  views: number;
}

/**
 * Review links interface.
 */
export interface ReviewLink {
  info: string;
  path: string;
  code?: string;
}

/**
 * Paramters used when retrieving a review from the api.
 */
export interface RetrieveReviewByIdParams {
  id: string;
  xsrf?: string;
}

/**
 * Paramters used when retrieving a review from the api.
 */
export interface RetrieveReviewByURLParams {
  brand: string;
  productName: string;
  reviewTitle: string;
}

/**
 * Review url path params.
 */
export interface RetrieveReviewParams {
  existing: string;
  requested: RetrieveReviewByURLParams;
  review?: Review;
  setReview?: (review: Review) => void;
}

/**
 * Review score aggregate.
 */
export interface AggregateReviewScore {
  averageScore: number;
  count: number;
  highestAllowedRating: number;
  lowestAllowedRating: number;
  totalScore: number;
}

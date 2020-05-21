/**
 * review.interface.ts
 * Interface for the reviews.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { Recommended } from './review.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  Category,
  ProductDetails,
  ProductDetailsDocument
} from '../product/product.interface';
import {
  ReviewStatistics,
  ReviewStatisticsDocument
} from '../reviewStatistics/reviewStatistics.interface';
import {
  PublicUserDetails,
  UserDetailsDocument
} from '../user/user.interface';
import {
  PlaylistEndpoints,
  VideoFormatPaths
} from '../../shared/video/Video.interface';

/**
 * Review document interface.
 */
export interface ReviewDocument extends Mongoose.Document {
  _id: string;
  created: Date;
  description: string;
  details: ReviewDetails;
  links: Array<LinkDetails>;
  privateDetails: PrivateReviewDetails;
  product: ProductDetailsDocument;
  published: Workflow;
  recommended: Recommended;
  sponsored: Array<string>;
  statistics: ReviewStatisticsDocument;
  thumbnails: Array<string>;
  title: string;
  url: string;
  user: UserDetailsDocument;
  video: AWSVideo;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  created: Date;
  description?: string;
  _id: string;
  links?: Array<LinkDetails>;
  product: ProductDetails;
  recommended: Recommended;
  statistics?: ReviewStatistics;
  sponsored: boolean;
  title: string;
  user: PublicUserDetails;
  videoURL: string;
  thumbnailURL: string;
}

/**
 * Review group.
 */
export type ReviewGroup = Record<string, Array<ReviewDetails>>;

/**
 * Private review interface.
 */
export interface PrivateReviewDetails extends ReviewDetails {
  published: Workflow;
}

/**
 * Review request body interface.
 */
export interface ReviewRequestBody {
  description: string;
  links: Array<LinkDetails>;
  product: string;
  recommended: Recommended;
  sponsored: boolean;
  title: string;
  videoTitle: string;
  videoSize: string;
  videoType: string;
}

/**
 * Categorised review groups.
 */
export interface CategorizedReviewGroup {
  category: Category;
  items: Array<ReviewGroupItem>;
}

/**
 * Categorized review group item.
 */
export interface ReviewGroupItem {
  category: Category;
  items: Array<ProductReviewGroup>;
}

/**
 * Group of reviews for a product.
 */
export interface ProductReviewGroup {
  product: ProductDetails;
  reviews?: Array<ReviewDetails>;
}

/**
 * SNS Notification message.
 */
export interface ReviewPublishedSNS extends AWSVideo {
  errorCode?: string;
}

/**
 * AWS video interface.
 */
export interface AWSVideo {
  archiveSource: boolean;
  cloudFront: string;
  destBucket: string;
  egressEndpoints: PlaylistEndpoints;
  enableMediaPackage: boolean;
  encodeJobId: string;
  encodingProfile: number;
  endTime: string;
  environment: string;
  frameCapture: boolean;
  frameCaptureHeight: number;
  frameCaptureWidth: string;
  guid: string;
  inputRotate: string;
  isCustomTemplate: boolean;
  jobTemplate: string;
  reviewId: string;
  srcBucket: string;
  srcHeight: number;
  srcMediaDuration: number;
  srcMetadataFile: string;
  srcVideo: string;
  srcWidth: number;
  startTime: string;
  thumbnail: Array<string>;
  thumbNailUrl: Array<string>;
  videoPaths: VideoFormatPaths;
  workflowName: string;
  workflowStatus: string;
  workflowTrigger: string;
}

/**
 * Links.
 */
export interface LinkDetails {
  title: string;
  path: string;
}

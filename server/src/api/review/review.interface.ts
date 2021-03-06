/**
 * review.interface.ts
 * Interface for the reviews.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import {
  Recommended,
  VideoType
} from './review.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  Category,
  ProductDetails,
  ProductDocument
} from '../product/product.interface';
import {
  ReviewStatisticsDetails,
  ReviewStatisticsDocument
} from '../reviewStatistics/reviewStatistics.interface';
import {
  PublicUserDetails,
  UserDocument
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
  product: ProductDocument;
  published: Workflow;
  recommended: Recommended;
  score: number;
  sponsored: Array<string>;
  statistics: ReviewStatisticsDocument;
  thumbnail: string;
  thumbnails: Array<string>;
  title: string;
  titleRaw: string;
  url: string;
  user: UserDocument;
  video: AWSVideo;
  videoType: VideoType;
  youtube: YouTubeVideo;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  _id: Mongoose.Types.ObjectId;
  created: Date;
  description?: string;
  endTime: number;
  links?: Array<LinkDetails>;
  product: ProductDetails;
  recommended: Recommended;
  startTime: number;
  statistics?: ReviewStatisticsDetails;
  sponsored: boolean;
  title: string;
  url: string;
  user: PublicUserDetails;
  videoType: VideoType;
  videoHeight?: number;
  videoURL: string;
  videoWidth?: number;
  thumbnail: string;
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
  endTime: number;
  links: Array<LinkDetails>;
  product: string;
  recommended: Recommended;
  sponsored: boolean;
  startTime: number;
  thumbnail: string;
  title: string;
  videoFileType: string;
  videoSize: string;
  videoTitle: string;
  videoType: VideoType;
  videoURL: string;
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

export interface YouTubeVideo {
  endTime: number;
  startTime: number;
  url: string;
}

/**
 * Links.
 */
export interface LinkDetails {
  code?: string;
  info: string;
  path: string;
}

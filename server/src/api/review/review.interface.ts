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
  ProductDetails,
  ProductDetailsDocument
} from '../product/product.interface';
import { ReviewStatistics } from '../reviewStatistics/reviewStatistics.interface';
import {
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
  product: ProductDetailsDocument;
  published: Workflow;
  recommended: Recommended;
  title: string;
  user: UserDetailsDocument;
  details: ReviewDetails;
  privateDetails: PrivateReviewDetails;
  url: string;
  video: AWSVideo;
  thumbnails: Array<string>;
}

/**
 * Review interface.
 */
export interface ReviewDetails {
  created: Date;
  _id: string;
  product: ProductDetails;
  recommended: Recommended;
  statistics?: ReviewStatistics;
  title: string;
  videoURL: string;
  thumbnailURL: string;
}

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
  product: string;
  recommended: Recommended;
  title: string;
  videoTitle: string;
  videoSize: string;
  videoType: string;
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

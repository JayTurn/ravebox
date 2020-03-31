/**
 * Video.interface.ts
 * Interfaces for the video files.
 */

// Interfaces.
import * as Stream from 'stream';
import * as S3 from 'aws-sdk/clients/s3';

export interface VideoUploadMetadata {
  srcVideo: string;
  archiveSource: boolean;
  frameCapture: boolean;
  srcBucket: string;
  destBucket: string;
  reviewId: string;
}

export interface UploadStream {
  writeStream: Stream;
  promise: S3.ManagedUpload;
}

/**
 * Video path formats.
 */
export interface VideoPaths {
  mp4Urls: Array<string>;
  hlsUrl: string;
}

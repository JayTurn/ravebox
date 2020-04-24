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
 * Endpoints for the playlist files.
 */
export interface PlaylistEndpoints {
  HLS: string;
  MSS: string;
  DASH: string;
  CMAF: string;
}

/**
 * Format paths for video formats.
 */
export interface VideoFormatPaths {
  mp4Outputs: Array<string>;
  mp4Urls: Array<string>;
  hlsPlaylist: string;
  hlsUrl: string;
}

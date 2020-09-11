/**
 * ImageUpload.interface.tsx
 * Interfaces for a uploading an image.
 */

// Enumerators.
import {
  ImageUploadPaths,
  ImageUploadState
} from './ImageUpload.enum';

/**
 * Interface for the image upload properties.
 */
export interface ImageUploadProps {
  id: string;
  aspectRatio?: number;
  buttonTitle: string;
  circleCrop?: boolean;
  maxFileSize?: number;
  path: string;
  requestPath: ImageUploadPaths;
  update: (path: string) => void;
  xsrf?: string;
}

/**
 * Inteface for the upload status.
 */
export interface ImageUploadStatus {
  completion: number;
  state: ImageUploadState;
}

/**
 * Interface for the cropped image area.
 */
export interface CroppedArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Image data interface.
 */
export interface ImageData {
  fileType: string;
  fileName: string;
  fileLastModified: number;
  maxFileSize: number;
}

/**
 * Interface for the image upload metadata.
 */
export interface PresignedImageResponse {
  presigned: {
    url: string;
    fields: any;
  },
  path: string;
}

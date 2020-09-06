/**
 * ImageUpload.enum.tsx
 * Enumerators for changing the image.
 */

/**
 * Enumerator for upload paths.
 */
export enum ImageUploadPaths {
  AVATAR = 'user/image/request',
  RAVE_POSTER = 'review/poster/request'
}

/**
 * Enumerator for the upload state.
 */
export enum ImageUploadState {
  COMPLETE = 'complete',
  ERROR = 'error',
  SUBMITTED = 'submitted',
  WAITING = 'waiting'
}


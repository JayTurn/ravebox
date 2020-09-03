/**
 * ImageUpload.interface.tsx
 * Interfaces for a generic image upload component.
 */

// Enumerators.
import { ImageUploadState } from './ImageUpload.enum';

export interface ImageUploadProps {
  name: string;
  filename: string;
  update: (data: File) => void;
}

export interface ImageUploadStatus {
  completion: number;
  state: ImageUploadState;
}

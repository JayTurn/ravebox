/**
 * FileUpload.interface.tsx
 * Interfaces for a generic file upload component.
 */

// Enumerators.
import { FileUploadState } from './FileUpload.enum';

export interface FileUploadProps {
  name: string;
  update: (data: File) => void;
}

export interface FileUploadStatus {
  completion: number;
  state: FileUploadState;
}

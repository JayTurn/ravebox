/**
 * FileUpload.tsx
 * Component to provide file upload functionality.
 */

// Modules.
import * as React from 'react';

// Interfaces.
import { FileUploadProps } from './FileUpload.interface';

/**
 * File upload component for handling form field upload.
 */
const FileUpload: React.FC<FileUploadProps> = (props: FileUploadProps) => {

  /**
   * Handles the file change event.
   *
   * @param { React.SynthenticEvent } e: the file upload event.
   */
  const handleChange: (
    e: React.FormEvent<HTMLInputElement>
  ) => void = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    if (e.currentTarget.files) {
      props.update(e.currentTarget.files[0]);
    }
  }

  return (
    <div className={`form-group`}>
      <input
        id={props.name}
        type='file'
        name={props.name}
        onChange={handleChange}
      />
    </div>
  )
};

export default FileUpload;

/**
 * Input.interface.tsx
 * Property interface for the input field component.
 */
'use strict';

// Import the dependent modules.
import * as React from 'react';

/**
 * Input interface.
 */
export interface InputProps {
  defaultValue?: string;
  description?: string;
  handleChange: (data: InputData) => void;
  hasError: string;
  name: string;
  required?: boolean;
  title: string;
  type: string;
  width?: number;
}

/**
 * Input data interface.
 */
export interface InputData {
  key: string;
  value: string;
}

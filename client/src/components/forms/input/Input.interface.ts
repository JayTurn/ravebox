/**
 * Input.interface.tsx
 * Property interface for the input field component.
 */
'use strict';

// Modules.
import * as React from 'react';
import { BaseTextFieldProps } from '@material-ui/core/TextField';

// Interfaces.
import { ValidationRules } from '../validation/Validation.interface';

/**
 * Input interface.
 */
export interface InputProps extends BaseTextFieldProps {
  defaultValue?: string;
  handleChange: (data: InputData) => void;
  name: string;
  required?: boolean;
  title: string;
  type: string;
  width?: number;
  validation?: ValidationRules;
}

/**
 * Input data interface.
 */
export interface InputData {
  key: string;
  value: string;
}

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
  allowAutocomplete?: boolean;
  defaultValue?: string;
  handleChange?: (fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (data: InputData) => void;
  handleFocus?: (e: React.SyntheticEvent) => void;
  name: string;
  required?: boolean;
  prefix?: string;
  title: string;
  type: string;
  width?: number;
  validation?: ValidationRules;
  variation?: 'fixed-mobile-bottom' | 'rounded';
}

/**
 * Input data interface.
 */
export interface InputData {
  key: string;
  value: string;
}

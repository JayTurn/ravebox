/**
 * MultiStepNavigation.interface.ts
 *
 * Interfaces for the multi-step navigation.
 */
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { MultiStepNavigationProgress } from './MultiStepNavigation.enum';

export interface MatchParams {
  id: string;
}

export interface MultiStepNavigationProps extends RouteComponentProps<MatchParams> {
  steps: Array<string>;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * RecommendationChip.interface.tsx
 * Interfaces for the recommendation chip.
 */

// Modules.
import * as React from 'react';

// Enumerators.
import { Recommended } from '../recommendation/Recommendation.enum';

/**
 * Interfaces for the recommendation chip component.
 */
export interface RecommendationChipProps {
  recommended: Recommended;
}

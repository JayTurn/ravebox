/**
 * Recommendation.interface.tsx
 * Interfaces for the recommendation component.
 */

// Enumerators.
import { Recommended } from './Recommendation.enum';

export interface RecommendationProps {
  recommended: Recommended;
  update: (recommended: Recommended) => void;
}

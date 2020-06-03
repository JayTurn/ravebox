/**
 * LoadingReviewList.interface.tsx
 * Interface for review lists that are loading.
 */

// Enumerators.
import { PresentationType } from '../../review/listByQuery/ListByQuery.enum';

/**
 * Properties for the review loading lists.
 */
export interface LoadingReviewListProps {
  presentationType: PresentationType;
}

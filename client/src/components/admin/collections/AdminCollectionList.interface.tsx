/**
 * AdminCollection.interface.tsx
 * Interfaces for showing lists of collections.
 */

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Interfaces.
import { Collection } from '../../collection/Collection.interface';

/**
 * Admin collection list display.
 */
export interface AdminCollectionListProps {
  add?: (collection: Collection) => void;
  collections: Array<Collection>;
  existingProductId: string;
  remove?: (collection: Collection) => void;
  viewState: ViewState;
}

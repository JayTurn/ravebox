/**
 * ListTitle.interface.tsx
 * Interface for the title displayed above lists.
 */

// Enumerators.
import { PresentationType } from '../../review/listByQuery/ListByQuery.enum';

export interface ListTitleProps {
  title: string;
  url: string;
  presentationType?: PresentationType;
}

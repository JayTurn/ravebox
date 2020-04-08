/**
 * AccessType.interface.tsx
 * Interfaces for the access type tabs.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { AccessOptions } from './AccessType.enum';

export interface AccessTypeProps extends RouteComponentProps {
  selected: AccessOptions;
}

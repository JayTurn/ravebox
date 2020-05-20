/**
 * Search.interface.tsx
 * Interfaces for the discover search results screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  DiscoverGroup,
  DiscoverSearchMatchParams
} from '../../../components/discover/Discover.interface';

/**
 * Search properties.
 */
export interface SearchProps extends RouteComponentProps<DiscoverSearchMatchParams> {
  discoverGroups?: Array<DiscoverGroup>;
  updateGroups?: (groups: Array<DiscoverGroup>) => void;
}

/**
 * AdminTags.interface.tsx
 * Interfaces for the screen to manage tags.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { SortDirection } from '../Sort.enum';
import { TagAssociation } from '../../tag/Tag.enum';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { Tag } from '../../tag/Tag.interface';

/**
 * Admin tags properties.
 */
export interface AdminTagsProps extends RouteComponentProps {
  xsrf?: string;
}

/**
 * Parameters for retrieving a list of tags.
 */
export interface RetrieveTagsListParams {
  filters?: TagSearchFilterParams;
  sort: TagSearchSortParams;
}

export interface RetrieveTagsListResponse extends APIResponse {
  tags: Array<Tag>;
}

/**
 * Filters for tag search.
 */
export interface TagSearchFilterParams {
  name?: string;
  association: TagAssociation;
}

/**
 * Sort parameters for tag search.
 */
export interface TagSearchSortParams {
  name: SortDirection;
}

/**
 * AdminManageTag.interface.tsx
 * Interfaces for the component to manage the tag.
 */

// Enumerators.
import { TagAssociation } from '../../tag/Tag.enum';

// Interfaces.
import { Tag } from '../../tag/Tag.interface';

/**
 * Admin manage tag properties.
 */
export interface AdminManageTagProps {
  association: TagAssociation;
  existing?: Array<Tag>;
  linkId: string;
  xsrf?: string;
}

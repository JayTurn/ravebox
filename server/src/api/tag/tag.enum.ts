/**
 * tag.enum.ts
 * Enumerators for tags.
 */

/**
 * Tag context type enumerator.
 */
export enum TagAssociation {
  CATEGORY = 'category',
  FILTER = 'filter',
  PRODUCT = 'product',
  REVIEW = 'review',
  SUB_CATEGORY = 'sub_category'
}

/**
 * The tag status enumerator.
 */
export enum TagStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  UNPUBLISHED = 'unpublished'
}

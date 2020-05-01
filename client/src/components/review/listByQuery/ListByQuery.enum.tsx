/**
 * ListByQuery.enum.tsx
 * Enumerators for the queries.
 */

/**
 * Query paths.
 */
export enum QueryPath {
  PRODUCT = 'review/list/product'
}

/**
 * List type used for setting lists in redux.
 */
export enum ReviewListType {
  PRODUCT = 'product'
}

/**
 * Presentation display for the list type.
 */
export enum PresentationType {
  GRID = 'grid',
  SCROLLABLE = 'scrollable',
  SIDEBAR = 'sidebar'
}

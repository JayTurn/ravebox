/**
 * Notification.enum.ts
 * Notification enumerators.
 */

/**
 * Enumerators for the transactional email templates.
 */
export enum EmailTemplate {
  SIGNUP = 1,
  REVIEW_DURATION_EXCEEDED = 2,
  REVIEW_PROCESSING_FAILED = 3,
  REVIEW_PUBLISHED = 4
}

/**
 * Enumerators for the notification lists.
 */
export enum ContactList {
  ALL = 2,
  REVIEWERS = 2
}

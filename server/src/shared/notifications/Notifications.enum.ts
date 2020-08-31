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
  REVIEW_PUBLISHED = 4,
  EMAIL_VERIFICATION = 5,
  PASSWORD_RESET = 6,
  INVITATION_REQUEST = 9
}

/**
 * Enumerators for the notification lists.
 */
export enum ContactList {
  ALL = 2,
  REVIEWERS = 3,
  REQUESTED_INVITE = 4
}

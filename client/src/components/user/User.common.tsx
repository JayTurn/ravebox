/**
 * User.common.tsx
 *
 * Common functions for users.
 */

// Enumerators.
import { Role } from './User.enum';

// Interfaces.
import { PrivateProfile } from './User.interface';

/**
 * Checks if the user has an admin role.
 *
 * @param { PrivateProfile } profile - the user's profile.
 */
export const isAdmin: (
  user: PrivateProfile
) => boolean = (
  user: PrivateProfile
): boolean => {
  return user.role.includes(Role.ADMIN);
}

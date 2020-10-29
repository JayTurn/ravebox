/**
 * User.common.tsx
 *
 * Common functions for users.
 */

// Enumerators.
import { Role } from './User.enum';

// Interfaces.
import {
  PrivateProfile,
  PublicProfile
} from './User.interface';

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

/**
 * Retrieves a an external user avatar.
 */
export const getExternalAvatar: (
  user?: PublicProfile
) => string | undefined = (
  user?: PublicProfile
): string | undefined => {

  let avatar: string | undefined;

  if (user && user.role !== Role.YOUTUBE) {
    avatar = user.avatar;
  } else {
    avatar = 'https://d3jb681o407t0s.cloudfront.net/images/avatars/5f7566a18d8dda006f5b0403/youtube_profile-xgl9y8mk9a5583e5fjpp.png';
  }

  return avatar;
}

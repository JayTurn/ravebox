/**
 * UpdateProfileLink.interface.tsx
 * Interfaces for the changing the users profile link.
 */

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import {
  PrivateProfile,
  UserLink
} from '../User.interface';

/**
 * Update profile link properties.
 */
export interface UpdateProfileLinkProps {
  link: UserLink;
  index: number;
  update: (data: InputData) => (index: number) => void;
}

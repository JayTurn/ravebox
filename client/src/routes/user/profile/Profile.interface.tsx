/**
 * Profile.interface.tsx
 * Interfaces for the user's profile screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import  { PrivateProfile } from '../../../components/user/User.interface';

/**
 * Profile properties.
 */
export interface ProfileProps extends RouteComponentProps {
  profile?: PrivateProfile;
}

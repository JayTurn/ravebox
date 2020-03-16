/**
 * PrivateRoute.interface.tsx
 * Interfaces for the private route.
 */

// Interfaces.
import { RouteProps } from 'react-router';
import { PrivateProfile } from '../../components/user/User.interface';

export interface PrivateRouteProps extends RouteProps {
  profile?: PrivateProfile;
  login?: (profile: PrivateProfile) => {};
}


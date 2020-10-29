/**
 * Home.interface
 * Interfaces for the Home component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  RaveStreamList
} from '../../components/raveStream/RaveStream.interface';

/**
 * Home properties.
 */
export interface HomeProps extends RouteComponentProps {
  raveStreamList?: RaveStreamList;
  updateList?: (raveStreamList: RaveStreamList) => void;
}

/**
 * Home.interface
 * Interfaces for the Home component.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import {
  RaveStreamCategoryList
} from '../../components/raveStream/RaveStream.interface';

/**
 * Home properties.
 */
export interface HomeProps extends RouteComponentProps {
  categoryList?: Array<RaveStreamCategoryList>;
  updateCategoryList?: (categoryList: Array<RaveStreamCategoryList>) => void;
}

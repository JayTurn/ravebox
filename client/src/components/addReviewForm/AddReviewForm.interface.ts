/**
 * AddReviewForm.interface.tsx
 * Interfaces for review creation form.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
//import { PrivateProfile } from '../User.interface';
import { APIResponse } from '../../utils/api/Api.interface';

/**
 * Add review form properties.
 */
export interface AddReviewFormProps extends RouteComponentProps { }

/**
 * Add review form response.
 */
export interface AddReviewFormResponse extends APIResponse { }

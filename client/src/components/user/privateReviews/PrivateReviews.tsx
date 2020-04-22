/**
 * PrivateReviews.tsx
 * Component rendering the authenticated user's reviews.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import * as React from 'react';

// Interfaces.
import { PrivateReviewsProps } from './PrivateReviews.interface';

/**
 * Private reviews component.
 */
const PrivateReviews: React.FC<PrivateReviewsProps> = (props: PrivateReviewsProps) => {
  return (
    <Grid container direction='row'>
    </Grid>
  );
}

export default PrivateReviews;

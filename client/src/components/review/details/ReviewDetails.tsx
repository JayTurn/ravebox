/**
 * ReviewDetails.tsx
 * Renders the component displaying the review.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Interfaces.
import { ReviewDetailsProps } from './ReviewDetails.interface';

/**
 * Renders the review details.
 */
const ReviewDetails: React.FC<ReviewDetailsProps> = (props: ReviewDetailsProps) => {
  return (
    <Grid container direction='column'>
      {props.review && 
        <Typography variant='h1'>
          { props.review.title } 
        </Typography>
      }
    </Grid>
  );
};

export default ReviewDetails;

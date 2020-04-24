/**
 * PrivateReviewCard.tsx
 * Card display of the private review.
 */

// Modules.
import * as React from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

// Interfaces.
import { PrivateReviewCardProps } from './PrivateReviewCard.interface';

/**
 * Private review card with editable options.
 */
const PrivateReviewCard: React.FC<PrivateReviewCardProps> = (props: PrivateReviewCardProps) => {
  return (
    <Card>
      <CardMedia
      />
      <CardContent>
      </CardContent>
    </Card>
  );
}

export default PrivateReviewCard;

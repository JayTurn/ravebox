/**
 * ChangeEmail.tsx
 * Component to support user's changing their email addres.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import * as React from 'react';

// Interfaces.
import { ChangeEmailProps } from './ChangeEmail.interface';

/**
 * Renders the form for a user to change their email.
 */
const ChangeEmail: React.FC<ChangeEmailProps> = (props: ChangeEmailProps) => {
  return (
    <Grid
      container
      direction='column'
    >
    </Grid>
  );
}

export default ChangeEmail;

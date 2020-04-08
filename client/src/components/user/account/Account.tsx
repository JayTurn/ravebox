/**
 * Account.tsx
 * User account settings component.
 */

// Modules.
import * as React from 'react';
import Grid from '@material-ui/core/Grid';

// Interfaces.
import { AccountProps } from './Account.interface';

/**
 * Renders profile settings for authenticated users.
 */
const Account: React.FC<AccountProps> = (props: AccountProps) => {
  return (
    <Grid
      container
      direction='column'
    >
      Settings    
    </Grid>
  );
};

export default Account;

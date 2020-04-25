/**
 * PageTitle.tsx
 * Page title component to provide consistency across screens.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Components.
import PaddedDivider from '../dividers/PaddedDivider';

// Interfaces.
import { PageTitleProps } from './PageTitle.interface';

/**
 * Page title display component.
 */
const PageTitle: React.FC<PageTitleProps> = (props: PageTitleProps) => {
  return (
    <Grid item xs={12} style={{marginTop: '3rem'}}>
      <Typography variant='h1' color='textPrimary'>
        {props.title}
      </Typography>
      <PaddedDivider />
    </Grid>
  );
}

export default PageTitle;

/**
 * TermsOfService.tsx
 * Terms of service screen route component.
 */

// Modules.
import * as React from 'react';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import LinkElement from '../../components/elements/link/Link';
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Interfaces.
import { TermsOfServiceProps } from './TermsOfService.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  })
);

/**
 * Terms of service route component.
 */
const TermsOfService: React.FC<TermsOfServiceProps> = (props: TermsOfServiceProps) => {
  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>Terms of service - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/policies/terms' />
      </Helmet>
      <PageTitle title='Terms of service' />
    </Grid>

  );
}

export default TermsOfService;

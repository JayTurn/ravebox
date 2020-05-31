/**
 * PrivacyPolicy.tsx
 * PrivacyPolicy screen route component.
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
import { PrivacyPolicyProps } from './PrivacyPolicy.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  })
);

/**
 * Privacy policy route component.
 */
const PrivacyPolicy: React.FC<PrivacyPolicyProps> = (props: PrivacyPolicyProps) => {
  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>Privacy Policy - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/policies/privacy-policy' />
      </Helmet>
      <PageTitle title='Privacy policy' />
    </Grid>

  );
}

export default PrivacyPolicy;

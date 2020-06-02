/**
 * PrivacyPolicy.tsx
 * PrivacyPolicy screen route component.
 */

// Modules.
import * as React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Link from '@material-ui/core/Link';
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
    heading: {
      fontWeight: 300,
      margin: theme.spacing(4, 0, 4)
    },
    padding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    paragraph: {
      margin: theme.spacing(2, 0)
    },
    subHeading: {
      color: theme.palette.primary.dark,
      fontWeight: 600,
      margin: theme.spacing(4, 0, 2)
    }
  })
);

/**
 * Privacy policy route component.
 */
const PrivacyPolicy: React.FC<PrivacyPolicyProps> = (props: PrivacyPolicyProps) => {
  const classes = useStyles();
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
      <Grid item xs={12} lg={9} className={clsx(classes.padding)}>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          What is the policy
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Introduction
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          This Ravebox Privacy Policy describes how your personal information is collected, used, and shared when you use the website available at https://ravebox.io and it’s network of products, services and features offered by Ravebox (collectively known as the “Service”).
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          The service we provide
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          The Service is provided by the entity, Altega Financial Pty Ltd, a company incorporated in and operating under the laws of Australia (referred to as “Ravebox”, “we”, “us”, or “our”).
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Applicable policy
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox values your privacy and that of all third-parties who may visit or use the Service and would like you to understand how we collect, use and disclose personal information provided by and about you. By using the Service, you are accepting the practices described in the Ravebox Privacy Policy and items linked within, which may be updated from time to time (collectively referred to as the “Policy”).
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          Information collected
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          What we collect
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          When you access or use the Service, we collect certain information about your device, including your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, we collect information about your engagement with the Service for the purpose of improving the user experience. We refer to this information collectively as “Engagement Data”.
        </Typography>
    <Typography variant='body1' className={clsx(classes.paragraph)}>
         The following types of technologies are used to collect Engagement Data:
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Cookies
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          “Cookies” are data files that are placed on your device or computer and often include an encrypted unique identifier. We use cookies to authenticate your access to the Service and collect anonymous Engagement Data to improve the user experience. For more information about cookies, and how to disable cookies, visit <Link href='http://www.allaboutcookies.org' target='_blank'>http://www.allaboutcookies.org</Link>
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Log files
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          “Log files” track actions occurring within the Service and may include your IP address, browser information, timestamps and Service actions performed. We use this data for the purpose of debugging Service issues and improving system performance.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Pixels & Tags
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          “Pixels” and “Tags,” are electronic files used to record anonymous information about the way you engage with the Service. We use Pixels and Tags for the purpose of collecting Engagement Data to improve the user experience.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Information provided by you
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          When you create an account on the Service, we collect and store the information provided by you, including but not limited to your email address and username in our system. We refer to this information as “Personal Data” and is necessary to provide you with a personalized service.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          How we use information
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Personal Data
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox uses Personal Data to provide personalized features and authenticated access to the Service. This includes but is not limited to your secure access to the service, information you share publicly within the service, linking Content created and distributed by you, assisting you with technical issues and providing historical Service events for your convenience (such as users you follow or comments you have submitted).
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox may use your email address to communicate with you, including to notify you of major changes to the Service, for customer service reasons, or update you of Service events related to Content you have provided.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Engagement Data
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox may use your Engagement Data for creating and enhancing Service features and functionality, manage relationships with Ravebox partners and affiliates, improve users experience with the Service by providing recommendations and by offering Content we believe you might find useful or interesting, including advertising and marketing messages, prevent fraud and abuse, and understand the usage trend of users.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Disclosing data
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox discloses Personal Data and Engagement Data to hosting, maintenance and security services necessary to provide the Service and analytics platforms such as Google Analytics and Amplitude for the purposes of analysing usage patterns and creating reports. We expect these third-parties to process information in accordance with this Policy and maintain reasonable confidentiality measures.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox may also share your Personal Data to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Data security
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox uses a range of measures to protect the integrity of the Service and security of your Personal Data. However, no security precautions or systems can be completely secure. Ravebox cannot guarantee or warrant the security of any data you provide and you agree that you do so at your own risk.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Do not track
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          Retention
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Data retention
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox maintains Engagement Data and Personal Data as long as it is required to by law (such as for tax and accounting purposes), for the purpose of fulfilling relevant purposes described in this Policy and as otherwise communicated to you. If you request Ravebox to close your account and delete your profile information, we will delete all information we are not required or permitted to retain by law.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Minors
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          If you are under 13 years of age, you are not permitted to use the Service. Please do not use Ravebox or its affiliated services.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Changes
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox reserves the right to update this privacy policy at any time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons. You continued use of the Service after these changes constitutes a binding acceptance of such changes.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Contact Ravebox
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@ravebox.io.
        </Typography>
      </Grid>
    </Grid>

  );
}

export default PrivacyPolicy;

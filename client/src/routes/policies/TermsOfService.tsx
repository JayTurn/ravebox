/**
 * TermsOfService.tsx
 * Terms of service screen route component.
 */

// Modules.
import Box from '@material-ui/core/Box';
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
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import LinkElement from '../../components/elements/link/Link';
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Hooks.
import { useAnalytics } from '../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';
import { TermsOfServiceProps } from './TermsOfService.interface';

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
 * Terms of service route component.
 */
const TermsOfService: React.FC<TermsOfServiceProps> = (props: TermsOfServiceProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const classes = useStyles();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: '/policies/terms',
          title: 'Terms of Service'
        },
        amplitude: {
          label: 'view terms'
        }
      });
      setPageViewed(true);
    }
  }, [pageViewed, setPageViewed]);

  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>Terms of service - Ravebox</title>
        <link rel='canonical' href='https://ravebox.io/policies/terms' />
      </Helmet>
      <PageTitle title='Terms of service' />
      <Grid item xs={12} lg={9} className={clsx(classes.padding)}>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          Welcome to Ravebox!
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Introduction
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Welcome to the platform known as Ravebox. The platform consists of the website available at https://ravebox.io and it’s network of products, services and features offered by Ravebox (collectively known as the “Service”).
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          The Service we provide
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Our mission is to support knowledge sharing through the communication of personal experiences and assisting one another to make informed decisions.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Our Service allows you to discover and share first-hand experiences with products and other topics though video and other content, acts as a platform to distribute original content, provide feedback and support connections.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          The Service is provided by the entity, Altega Financial Pty Ltd, a company incorporated in and operating under the laws of Australia (referred to as “Ravebox”, “we”, “us”, or “our”).
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Applicable terms
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          When using the Service, you will be subject to the Ravebox’s <LinkElement title='Community Guidelines' path='/policies/community-guidelines'/>, the <LinkElement title='Privacy Policy' path='/policies/privacy-policy'/> and additional terms and conditions and policies posted on the Ravebox Terms of Service and linked within, which may be updated from time to time (collectively referred to as the “Agreement”).
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Please read this Agreement carefully and ensure you understand it. The Agreement is legally binding, if you do not understand it or do not accept any part of it, you may not use the Service.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)}>
          Who can use the Service?
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Requirements
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          To use the Service, you must be at least 13 years of age. If you are considered a minor in your country, you may only use the Service if your parent or guardian has expressly provided you with permission to do so.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Permission provided by a parent or guardian
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          If you are a parent or guardian providing permission for your child to use the Service, you must read the Agreement to your child and ensure they understand it. As a parent or guardian, by allowing your child to use the Service, you are bound to the terms of this Agreement and responsible for your child’s activities on the Service.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Using the Service on behalf of a business
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          If you are using the Service on behalf of an entity such as a company, organisation or other, you represent that such entity accepts and agrees to be bound to the Agreement and expressly provides you with permission to act on their behalf.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)}>
          Use of the Service
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Content
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          “Content” is collectively defined as materials provided by you, Ravebox or a third-party in the form of video, audio, text (including but not limited to comments and chat), branding (including trademarks, logos, trade names and service marks), graphics, photos, software and metrics found on the service.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Persons and/or entities are solely responsible for the Content and the consequences of posting or publishing it on the Service. Under no circumstances is Ravebox obligated to host or serve Content.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Accounts
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Some features of the Service require you to open an account and provide certain information such as an account name, email address and password. With an active account, you will be able to create Content, rate reviews, follow channels and create your own, plus more. You may <LinkElement title='create an account here' path='/user/signup'/>, using the instructions provided.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You are responsible for the confidentiality of your password and restricting access to your devices. You should not reuse your account password on third-party applications or permit others to use your account credentials. You are responsible for all activities conducted with your account credentials, under the terms of the Agreement.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Selling, renting, leasing, sharing or providing access to your account is not permitted without consent provided, in writing by Ravebox.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Your privacy
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox takes your privacy seriously. Please read our <LinkElement title='Privacy Policy' path='/policies/privacy-policy'/> to understand how Ravebox manages your personal data and ensures your privacy when using the Service.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Service permissions and restrictions
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You are permitted to use the Service for its intended purpose (as set out in the <LinkElement title='Community Guidelines' path='/policies/community-guidelines'/>) as long as you comply with the Agreement and all applicable laws.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          The following list of restrictions apply to your use of the Service at all times. You are not permitted to:
        </Typography>
        <Box component='ol'>
          <Typography variant='body1' component='li' className={clsx(classes.paragraph)}>
            use automated means to access or collect data (including but not limited to scrapers and botnets) from the Service, or attempt to access data you are not permitted to access using any means except in the case of public search engines in accordance with Ravebox’s robots.txt file
          </Typography>
          <Typography variant='body1' component='li' className={clsx(classes.paragraph)}>
            use the Service in any capacity to access, distribute, download or modify Content except where you have been expressly authorized by the Service
          </Typography>
          <Typography variant='body1' component='li' className={clsx(classes.paragraph)}>
            use the Service to create, upload, distribute or store any Content that is unlawful, fraudulent, discriminatory, breaches the privacy or public rights of others
          </Typography>
          <Typography variant='body1' component='li' className={clsx(classes.paragraph)}>
            use any means to interfere or impair the security, intended purpose or appearance of the Service or it’s Content
          </Typography>
          <Typography variant='body1' component='li' className={clsx(classes.paragraph)}>
            harvest or collect email addresses, usernames, handles and other identifying information unless expressly authorized by that person
          </Typography>
          <Typography variant='body1' component='li' className={clsx(classes.paragraph)}>
            interfere with or cause the inaccurate measurements (through paid or incentivised services) of user engagement with the Service or Content including but not limited to increasing views, alter ratings, increase followers or modifying metrics in any way
          </Typography>
        </Box>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Rights of the Service
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox reserves the right to change, improve or discontinue the Service or any part of it. When reasonably possible to do so, Ravebox will notify users of changes that might affect them. You agree that Ravebox may at times be required to make instant changes to the Service in order to comply with legal and regulatory changes, improve security and prevent Service abuse.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          By using the Service, you are not granted ownership of or rights to any aspect of the Service.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)}>
          What you can share
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>  Creating and distributing content
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You may be able to create and distribute Content on the Service as long as you have an active account, abide by the <LinkElement title='Community Guidelines' path='/policies/community-guidelines'/>, the Agreement and applicable laws. You are legally responsible for the Content you create, upload and distribute to the Service, including but not limited to copyrighted material and unlawful material.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Rights granted to the Service
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You maintain ownership of the intellectual property rights of your content. By creating and distributing Content on the Service, we require that you grant certain rights to Ravebox and other users of the Service. These rights are described below:
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          License granted to Ravebox
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          When you create and distribute Content on the Service, you grant Ravebox a non-exclusive, transferable, sub-licensable, worldwide and royalty free license to use that Content (including to host, distribute, modify, copy, run, create derivative works, publicly perform or display) for the intended Service operation, promotion and redistribution.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          License granted to others
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You grant each user of the service a non-exclusive, worldwide and royalty free license to access your Content through use of the Service and only as supported by a feature of the Service. To clarify, this license prevents a user from making use of your Content for any purpose independent of the Service or its supported features.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          License Period
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          When Content is provided to the Service, a license is granted by you for a reasonable period of time after your Content is removed or deleted from the Service. Under the Agreement, Ravebox may not display or distribute Content which you have deleted or removed but reserves the right to retain copies of video Content on its servers.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Content removal
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You can delete or remove content from the Service at any time. When Content is deleted or removed, it will no longer be visible to other users of the Service. Ravebox may be required to retain Content on its servers where technical and/or legal requirements prevent deletion.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          We can remove your Content at our discretion if we reasonably believe it may breach this Agreement, the <LinkElement title='Community Guidelines' path='/policies/community-guidelines'/>, cause harm to Ravebox, third-parties or Service users. You may receive notification of content removal when reasonably acceptable to do so.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)}>
          Account termination
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Terminating your account
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          You may terminate your account at any time. Terminating your account will result in the removal of all public facing account information and de-identification of data. Ravebox may be required to maintain de-identified activity in its servers for technical reasons (such as de-identified video ratings and comments).
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Account termination by Ravebox
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox reserves the right to suspend or terminate your access to the Service if you breach this Agreement, the <LinkElement title='Community Guidelines' path='/policies/community-guidelines'/>, or as a requirement of any applicable law without notice and at our sole discretion.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Upon account termination
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Should your account be terminated, you may continue to access the Service without an account but within the bounds of this Agreement. You are within your rights to appeal an account termination via our contact form.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)}>
          Other legal terms
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Warranty disclaimer
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW: (A) THE RAVEBOX SERVICE AND THEREFORE THE CONTENT AND MATERIALS CONTAINED THEREIN ARE PROVIDED ON AN “AS IS” BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED (B) THE RAVEBOX PARTIES DISCLAIM ALL OTHER WARRANTIES, STATUTORY, EXPRESS, OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT AS TO THE RAVEBOX SERVICES, INCLUDING ANY INFORMATION, CONTENT, OR MATERIALS CONTAINED THEREIN; (C) RAVEBOX DOES NOT REPRESENT OR WARRANT THAT THE CONTENT OR MATERIALS ON THE RAVEBOX SERVICES ARE ACCURATE, COMPLETE, RELIABLE, CURRENT, OR ERROR-FREE; (D) RAVEBOX IS NOT RESPONSIBLE FOR TYPOGRAPHICAL ERRORS OR OMISSIONS RELATING TO TEXT OR PHOTOGRAPHY OR TRADEMARKS; AND (E) WHILE RAVEBOX ATTEMPTS TO MAKE YOUR ACCESS AND USE OF THE TWITCH SERVICES SAFE, RAVEBOX CANNOT AND DOES NOT REPRESENT OR WARRANT THAT THE RAVEBOX SERVICES OR OUR SERVER(S) ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS, AND THEREFORE, YOU SHOULD USE INDUSTRY-RECOGNIZED SOFTWARE TO DETECT AND DISINFECT VIRUSES FROM ANY DOWNLOAD. NO ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM RAVEBOX OR THROUGH THE RAVEBOX SERVICES WILL CREATE ANY WARRANTY NOT EXPRESSLY STATED HEREIN.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Limitation of liability
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW: (A) IN NO EVENT SHALL RAVEBOX OR THE SERVICE BE LIABLE FOR ANY DIRECT, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES, OR ANY OTHER DAMAGES OF ANY KIND, INCLUDING BUT NOT LIMITED TO LOSS OF USE, LOSS OF PROFITS, OR LOSS OF DATA, WHETHER IN AN ACTION IN CONTRACT, TORT (INCLUDING BUT NOT LIMITED TO NEGLIGENCE), OR OTHERWISE, ARISING OUT OF OR IN ANY WAY CONNECTED WITH THE USE OF OR INABILITY TO USE THE RAVEBOX SERVICES, THE CONTENT OR THE MATERIALS, INCLUDING WITHOUT LIMITATION ANY DAMAGES CAUSED BY OR RESULTING FROM RELIANCE ON ANY INFORMATION OBTAINED FROM RAVEBOX, OR THAT RESULT FROM MISTAKES, OMISSIONS, INTERRUPTIONS, DELETION OF FILES OR EMAIL, ERRORS, DEFECTS, VIRUSES, DELAYS IN OPERATION OR TRANSMISSION, OR ANY FAILURE OF PERFORMANCE, WHETHER OR NOT RESULTING FROM ACTS OF GOD, COMMUNICATIONS FAILURE, THEFT, DESTRUCTION, OR UNAUTHORIZED ACCESS TO RAVEBOX’S RECORDS, PROGRAMS, OR SERVICES; AND (B) IN NO EVENT SHALL THE AGGREGATE LIABILITY OF RAVEBOX OR IT’S PARTNERS, WHETHER IN CONTRACT, WARRANTY, TORT (INCLUDING NEGLIGENCE, WHETHER ACTIVE, PASSIVE, OR IMPUTED), PRODUCT LIABILITY, STRICT LIABILITY, OR OTHER THEORY, ARISING OUT OF OR RELATING TO THE USE OF OR INABILITY TO USE THE RAVEBOX SERVICES EXCEED THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THE RAVEBOX SERVICES DURING THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE DATE OF THE CLAIM OR ONE HUNDRED DOLLARS, WHICHEVER IS GREATER. [1] TO THE EXTENT THAT APPLICABLE LAW PROHIBITS LIMITATION OF SUCH LIABILITY, RAVEBOX SHALL LIMIT ITS LIABILITY TO THE FULL EXTENT ALLOWED BY APPLICABLE LAW.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Indemnity
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          To the fullest extent permitted by law, you agree to hold harmless, defend and indemnify Ravebox, it’s officers, directors, affiliate companies, employees and agents from all claims, losses, damages, liabilities, obligations costs, debt  and expenses related to your access and use of the Service, any use or distribution of your Content, your violation of any term of this Agreement, your violation of copyright, property or the rights of any third-party or unlawful activity. This defense and indemnification obligation will survive this Agreement and your use of the Service.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Links to third-parties
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Content provided on the Service may contain links to third-party services and websites that are not owned or controlled by Ravebox. Ravebox assumes no responsibility for such services or websites. When you leave the Ravebox Service, it is your responsibility to read the terms and privacy policy of third-party services and websites.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)}>
          About the Agreement
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Changes to the Agreement
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Ravebox may be required to change this Agreement periodically to align with Service updates, legal or regulatory changes and security purposes. Ravebox will endeavour to provide reasonable notice of any changes to the Agreement where permitted. Changes to the Agreement are only applicable moving forward and should you not agree to the updated terms, it is your responsibility to terminate your account and remove any Content you have created and distributed on the Service.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Continuation of the Agreement
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          The following terms of the Agreement will remain applicable to you despite ending your use of the Service: “Other legal considerations”, “About the Agreement” and the licenses you have granted under the “License period”.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          If a particular term of the Agreement is unenforceable for any reason, this will not affect any other terms.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Waiver
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          If we fail to exercise or enforce the Agreement, either immediately or in the future, this does not constitute a waiver of any rights that we may have (such as the right to take future action).
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Agreement effective as of June 2, 2020
        </Typography>
      </Grid>
    </Grid>

  );
}

export default TermsOfService;

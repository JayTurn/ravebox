/**
 * CommunityGuidelines.tsx
 * CommunityGuidelines screen route component.
 */

// Modules.
import * as React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles, makeStyles, Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import LinkElement from '../../components/elements/link/Link';
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Hooks.
import { useAnalytics } from '../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';
import { CommunityGuidelinesProps } from './CommunityGuidelines.interface';

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
 * Community guidelines route component.
 */
const CommunityGuidelines: React.FC<CommunityGuidelinesProps> = (props: CommunityGuidelinesProps) => {
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
          path: `${props.location.pathname}${props.location.search}`,
          title: 'Community Guidelines'
        },
        amplitude: {
          label: 'view community guidelines'
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
        <title>Community Guidelines - Ravebox</title>
        <link rel='canonical' href='https://ravebox.io/policies/community-guidelines' />
      </Helmet>
      <PageTitle title='Community guidelines' />
      <Grid item xs={12} lg={9} className={clsx(classes.padding)}>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          Introduction
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Our vision
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          We want Ravebox to be a forum for people to share knowledge through real experiences and to help one another make informed decisions. To make this possible, we ask that you create authentic and original content and to respect and be kind to everyone on Ravebox.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          In combination with our <LinkElement title='Terms of Service' path='/policies/terms'/>, the Community Guidelines have been written to help us nurture and protect our diverse, brilliant community. By accessing and using Ravebox, you agree to these guidelines and any future changes we may provide from time to time.
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          To maintain the integrity of our community, Ravebox reserves the right to suspend, disable or delete any account at any time for any actions we deem to be harmful, inappropriate or not aligned with the guidelines outlined below.
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          Guidelines
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Share authentic and original content
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Express yourself authentically through original content. If you post content copied or collected from the Internet or where you don’t own the rights, you may be infringing on intellectual property rights of someone else and we may be required to remove your content.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Disallowed content
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          We are supportive of creative expression, but for a number of reasons, nudity and sexually explicit content (including but no limited to pornography and sexual services) and profanity are not allowed on Ravebox. Should content disallowed content, Ravebox is within its rights to remove your content and suspend, disable or delete your account.
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Be kind and respectful
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
         We want to nurture a community where all members feel safe to share their knowledge and experience. We understand that you may not agree with content provided by others but we hope you can remain kind and respectful in your content and activities. 
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
         Ravebox will remove content that shames, degrades or bullies private individuals, hate speech, threatening terminology and will suspend or delete accounts that are used to conduct (including but not limited to harassment, blackmail and spamming) negative behaviour towards others. 
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
         Ravebox does not tollerate discrimination or attacks (in any shape or form) against anyone based on gender, gender identity, sexual orientation, sex, ethnicity, race, religious belief or affiliation, disability or disease. 
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Abide by the law
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          We want to nurture a community where all members feel safe to share their knowledge and experience. We understand that you may not agree with content provided by others but we hope you can remain kind and respectful in your content and activities. 
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          Keep it real
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Help us keep Ravebox authentic and spam-free by not posting large amounts of repetitive or unwanted messages, tampering or artificially inflating ratings, recommendations, views and follows or repeatedly contacting users for commercial purposes without consent. 
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          Whilst you can use Ravebox without disclosing your real name, we don’t allow you to impersonate others or create accounts to circumvent or violate guidelines. 
        </Typography>
        <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
          Let’s work together
        </Typography>
        <Typography variant='h3' className={clsx(classes.subHeading)}>
          We all make Ravebox what it is
        </Typography>
        <Typography variant='body1' className={clsx(classes.paragraph)}>
          The Ravebox community is what you make it. You are an important part of our community and we’d like you to help us keep it amazing. If you come across content that you believe violates the Community Guidelines, please let us know and we’ll review it as soon as possible. If you disagree with content but it doesn’t violate the Community Guidelines, we ask that you unfollow the individual. Should that content be in the form of a comment or message, you are free to delete it.
        </Typography>
      </Grid>
    </Grid>

  );
}

/**
 * Map the redux state to the discover properties.
 *
 */
function mapStateToProps(state: any, ownProps: CommunityGuidelinesProps) {
  return {
    ...ownProps
  };
}

export default withRouter(connect(
    mapStateToProps,
)(CommunityGuidelines));

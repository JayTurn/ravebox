/**
 * FAQ.tsx
 * FAQ screen route component.
 */

// Modules.
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import LinkElement from '../../components/elements/link/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { StyleType } from '../../components/elements/link/Link.enum';

// Hooks.
import { useAnalytics } from '../../components/analytics/Analytics.provider';

// Interfaces.
import { FAQProps } from './Faq.interface';
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    expansionIcon: {
      color: theme.palette.text.secondary,
    },
    padding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    paragraph: {
      marginBottom: theme.spacing(2)
    }
  })
);

/**
 * Styled accordion.
 */
const StyledAccordion = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: 'transparent',
    border: `1px solid rgba(0,0,0,0.1)`,
    boxShadow: 'none',
    '&:before': {
      display: 'none'
    },
    marginBottom: theme.spacing(1)
  },
  expanded: {
    margin: `8px 0 !important`
  }
}))(Accordion);

/**
 * Styled accordion summary.
 */
const StyledAccordionSummary = withStyles((theme: Theme) => ({
  root: {
    margin: 0,
    minHeight: `24px !important`,
    padding: theme.spacing(0, 2),
  },
  content: {
    fontSize: '1.1rem',
    fontWeight: 500,
    margin: theme.spacing(0)
  },
  expanded: {
    marginBottom: `0px !important`,
    marginTop: `0px !important`
  },
}))(AccordionSummary);

/**
 * Styled accordion details.
 */
const StyledAccordionDetails = withStyles((theme: Theme) => ({
  root: {
    flexDirection: 'column',
    padding: theme.spacing(2, 2, 3)
  }
}))(AccordionDetails);

/**
 * FAQ route component.
 */
const FAQ: React.FC<FAQProps> = (props: FAQProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  // Set an expanded state for the accordion content.
  const [expanded, setExpanded] = React.useState<string>('');

  /**
   * On updates, check if we need to track the page view.
   */
  React.useEffect(() => {
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: 'FAQ'
        },
        amplitude: {
          label: 'view faq'
        }
      });
      setPageViewed(true);
    }
  }, [pageViewed]);

  /**
   * Handles the expansion change event.
   */
  const handleExpansion: (
    item: string
  ) => void = (
    item: string
  ): void => {
    if (expanded === item) {
      setExpanded('');
    } else {

      // Track the analytics event.
      analytics.trackEvent('select faq item')({
        'question': item
      });

      setExpanded(item);
    }
  }

  /**
   * Render the about JSX elements.
   */
  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>FAQ - Ravebox</title>
        <meta name='description' content={`Find answers to commonly asked questions about Ravebox, a place to find and compare products through short form videos.`} />
        <link rel='canonical' href='https://ravebox.io/about' />
      </Helmet>
      <PageTitle title='FAQ' />
      <Grid item xs={12} lg={9} className={clsx(classes.padding)}>
        <StyledAccordion
          square
          expanded={expanded === 'Why does ravebox exist?'}
          onChange={() => handleExpansion('Why does ravebox exist?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            Why does Ravebox exist?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Ravebox was created to make discovering and comparing products easier.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              To find information about products, you currently have to bounce between search engines, blog sites, shopping sites and social platforms. Even then, it's hard to determine what information is authentic.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              We decided there was a better way.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Instead of making you search for product information across many locations, we have created a place where the information comes to you in the form of short videos (raves). Brought to you by real people talking about their authentic experiences. Whether they recommend a product or not.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Our vision is with a single search on Ravebox, you will find all of the information you need about a product from the experiences of many people and feel confident that you can make a good decision to buy a product.
            </Typography>
            <Typography variant='body1'>
              We have a long way to go and we plan to be here long term to reward ravers for their sharing their experiences.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'Why is there a waitlist?'}
          onChange={() => handleExpansion('Why is there a waitlist?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            Why is there a waitlist?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Ravebox is a new platform and it's up to us to earn your trust. We're not a shopping site, we're a platform to help people make better product decisions. Authentic content is extremely important to us.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              In the very early stages, we have to support ravers creating authentic raves that suit the Ravebox vibe. We're a small team and we currently work closely with ravers to post raves, help them build their channel and promote their content.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Once the Ravebox trailblazers have established themselves it will set an example for new ravers to follow. At that point we can start opening up registration to the general public.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'How is a rave different to a review?'}
          onChange={() => handleExpansion('How is a rave different to a review?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            How is a rave different to a review?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              You can think of a rave as somewhere between a written review where people only talk about their experience and a long form video review where people talk in depth about product features.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              What makes a great product isn't its features, it's the way those features improve your life and that's different for everyone.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Raves are short videos talking about your unique experience with a product. Why you bought it, how you use it and what impact the product or specific features have had on your life.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              A rave is about you.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'Why are raves limited to 3 minutes in length?'}
          onChange={() => handleExpansion('Why are raves limited to 3 minutes in length?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            Why are raves limited to 3 minutes in length?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              At Ravebox, we believe there is value in learning from the experience of 5 different people talking for 3 minutes each, rather than one person talking for 15 minutes. After all, what makes a product great for one person, may not be the same for you.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              We make it faster for you to find out what works for most people and relate that back to your own experience.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'How can you trust what ravers say?'}
          onChange={() => handleExpansion('How can you trust what ravers say?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            How can you trust what ravers say?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Ravebox values authenticity above all else on our platform. Here are some ways we ensure ravers remain authentic in their raves:
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Ravers are permitted to rave about products they both recommend and don't recommend. Ravebox is not about selling products, it's about sharing experiences.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Ravers must indicate if they were sponsored for a rave. If we find a rave has been marked incorrectly, we will work together with a raver to resolve it.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              It's in every raver's best interests to create authentic raves. Every rave they create can be seen on their channel and is used to build their reputation.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'What products can I rave about?'}
          onChange={() => handleExpansion('What products can I rave about?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            What products can I rave about?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Ravebox is currently focused on Tech and Health & Beauty products but our platform supports all types of products.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              If you have a history of reviewing products in a different category, we'd still love for you to apply to be a Ravebox trailblazer by joining the waitlist.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'How does Ravebox make money?'}
          onChange={() => handleExpansion('How does Ravebox make money?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            How does Ravebox make money?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Of course we have to make money but for now we don't need to. In the future, we will be introducing various ways for products to make money and that will be used to reward our ravers.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Our belief is that you should be fairly rewarded for sharing your product experiences.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'Can I make money with Ravebox?'}
          onChange={() => handleExpansion('Can I make money with Ravebox?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            Can I make money with Ravebox?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Right now, you can share promo codes and affiliate links to products you rave about. In the future, we will be introducing other ways for you to make money based on the products you rave about.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Here's a hint, you won't need to have thousands of followers to make money, you just need to rave about products.
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'Does Ravebox work with brands?'}
          onChange={() => handleExpansion('Does Ravebox work with brands?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            Does Ravebox work with brands?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              Absolutely. Products wouldn't be providing their value without the hard work brands do to create them.
            </Typography>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              We are currently establishing relationships with brands. If you're associated with a brand and would like to get in touch, please contact us via the "Help" button. We have lots to discuss!
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
        <StyledAccordion
          square
          expanded={expanded === 'How do I contact Ravebox?'}
          onChange={() => handleExpansion('How do I contact Ravebox?')}
        >
          <StyledAccordionSummary
            expandIcon={<ExpandMoreRoundedIcon className={clsx(classes.expansionIcon)}/>}
          >
            How do I contact Ravebox?
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Typography variant='body1' className={clsx(classes.paragraph)}>
              You can get in touch with us via the "Help" button you see floating around Ravebox. If you have any questions we haven't answered here, please get in touch because we love speaking with everyone!
            </Typography>
          </StyledAccordionDetails>
        </StyledAccordion>
      </Grid>
    </Grid>
  );
}

/**
 * Map the redux state to the discover properties.
 *
 */
function mapStateToProps(state: any, ownProps: FAQProps) {
  return {
    ...ownProps
  };
}

export default withRouter(connect(
  mapStateToProps
)(FAQ));

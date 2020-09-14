/**
 * About.tsx
 * About screen route component.
 */

// Modules.
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
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import LinkElement from '../../components/elements/link/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import ContentBlock from '../../components/elements/contentBlock/ContentBlock';

// Enumerators.
import { ColorStyle } from '../../components/elements/contentBlock/ContentBlock.enum';
import { StyleType } from '../../components/elements/link/Link.enum';

// Hooks.
import { useAnalytics } from '../../components/analytics/Analytics.provider';

// Interfaces.
import { AboutProps } from './About.interface';
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: theme.spacing(4)
    },
    container: {
      padding: theme.spacing(4, 2, 6),
    },
    containerLarge: {
      padding: theme.spacing(12, 2, 16)
    },
    containerText: {
      fontSize: '1.4rem',
      fontWeight: 500,
      marginBottom: theme.spacing(4),
      textAlign: 'center'
    },
    containerTextLarge: {
      fontSize: '1.6rem'
    },
    containerTitle: {
      fontSize: '2rem',
      fontWeight: 300,
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    containerTitleLarge: {
      fontSize: '2.5rem'
    },
    heavy: {
      fontWeight: 700
    },
    primaryHighlight: {
      color: theme.palette.primary.main,
      fontWeight: 600
    },
    primaryContainer: {
      backgroundColor: theme.palette.primary.dark,
    },
    primaryContainerText: {
      color: theme.palette.common.white
    },
    primaryContainerTitle: {
    },
    secondaryContainer: {
      backgroundColor: theme.palette.secondary.dark,
    },
    secondaryContainerText: {
      color: theme.palette.common.white,
      textShadow: `0 1px 1px rgba(0,32,27,0.2)`
    },
    whiteContainer: {
      backgroundColor: theme.palette.common.white,
    },
    whiteContainerText: {
    }
  })
);

/**
 * About route component.
 */
const About: React.FC<AboutProps> = (props: AboutProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * On updates, check if we need to track the page view.
   */
  React.useEffect(() => {
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: 'About Ravebox'
        },
        amplitude: {
          label: 'view about'
        }
      });
      setPageViewed(true);
    }
  }, [pageViewed]);

  /**
   * Render the about JSX elements.
   */
  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>About Ravebox - Ravebox</title>
        <meta name='description' content={`Share short video reviews of products and connect with people you can count on for recommendations and advice on Ravebox.`} />
        <link rel='canonical' href='https://ravebox.io/about' />
      </Helmet>
      <ContentBlock
        background={ColorStyle.WHITE}
        title={
          <React.Fragment>
            Ravebox is where you come to talk about your experiences with products.
          </React.Fragment>
        }
        bodyFirst={
          <React.Fragment>
            Everyone is here to discover and compare the products you talk about with videos you share.
          </React.Fragment>
        }
        bodySecond={
          <React.Fragment>
            <Box component='span' className={clsx(
              classes.heavy
            )}>We call them raves</Box>.
          </React.Fragment>
        }
        action={{
          path: '/apply',
          title: 'Interested?',
          track: {
            context: 'about',
            targetScreen: 'join waitlist'
          }
        }}
      />
      <ContentBlock
        background={ColorStyle.PRIMARY}
        title={
          <React.Fragment>
            A rave is a <Box component='span' className={clsx(
              classes.heavy
            )}>short video</Box> where you creatively talk about your unique experience with a product.
          </React.Fragment>
        }
        bodyFirst={
          <React.Fragment>
            People watch your raves to find out why you tried a product, how you used it and whether or not it improved your life in some way. 
          </React.Fragment>
        }
        bodySecond={
          <React.Fragment>
            You can share promo codes and links to buy products so people can support you.
          </React.Fragment>
        }
        action={{
          path: '/apply',
          title: 'How about now?',
          track: {
            context: 'about',
            targetScreen: 'join waitlist'
          }
        }}
      />
      <ContentBlock
        background={ColorStyle.WHITE}
        title={
          <React.Fragment>
            It doesn't matter if you have 1 follower or 1 million followers, 
            <Box component='span' className={clsx(
              classes.heavy
            )}> your raves</Box> can be found.
          </React.Fragment>
        }
        bodyFirst={
          <React.Fragment>
            When someone searches for a product they will find every rave that has been created for it. Including yours!
          </React.Fragment>
        }
        bodySecond={
          <React.Fragment>
            The more raves a product has, the more likely your rave will be seen.
          </React.Fragment>
        }
        action={{
          path: '/apply',
          title: 'Still reading?',
          track: {
            context: 'about',
            targetScreen: 'join waitlist'
          }
        }}
      />
      <ContentBlock
        background={ColorStyle.SECONDARY}
        title={
          <React.Fragment>
            Your <Box component='span' className={clsx(
              classes.heavy
            )}>channel</Box> is dedicated to all of your product recommendations and advice.
          </React.Fragment>
        }
        bodyFirst={
          <React.Fragment>
            Everyone can follow your channel and receive updates when you post new content.
          </React.Fragment>
        }
        bodySecond={
          <React.Fragment>
            Advocate for products you're passionate about and help people make better decisions.
          </React.Fragment>
        }
        action={{
          path: '/apply',
          title: 'Join waitlist',
          track: {
            context: 'about',
            targetScreen: 'join waitlist'
          }
        }}
      />
    </Grid>
  );
}

/**
 * Map the redux state to the discover properties.
 *
 */
function mapStateToProps(state: any, ownProps: AboutProps) {
  return {
    ...ownProps
  };
}

export default withRouter(connect(
  mapStateToProps
)(About));

/**
 * InvitationRequestSuccess.tsx
 * InvitationReqestSuccess route component.
 */

// Dependent modules.
import AccessType from '../../../components/user/accessType/AccessType';
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
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
import * as React from 'react';
import ShareButton from '../../../components/share/ShareButton';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import ContentBlock from '../../../components/elements/contentBlock/ContentBlock';
import InvitationRequestForm from '../../../components/invitation/invitationRequestForm/InvitationRequestForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';
import { ColorStyle } from '../../../components/elements/contentBlock/ContentBlock.enum';
import {
  ShareStyle,
  ShareType
} from '../../../components/share/ShareButton.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  InvitationRequestSuccessProps,
} from './InvitationRequestSuccess.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bodySpacing: {
      marginBottom: theme.spacing(4)
    },
    heading: {
      fontWeight: 300,
      margin: theme.spacing(4, 0, 4)
    },
    padding: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
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
 * InvitationRequestSuccess component.
 */
const InvitationRequestSuccess: React.FC<InvitationRequestSuccessProps> = (
  props: InvitationRequestSuccessProps
) => {

  // Define the component classes.
  const classes = useStyles();

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: 'Applied to join waitlist'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed, props.location.pathname]);

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
      >
        <Helmet>
          <title>Thanks for applying to join - Ravebox</title>
          <meta name='description' content={`Ravebox is a place to share videos videos talking about your experiences with products and become a trusted source for recommendations and advice.`} />
          <link rel='canonical' href='https://ravebox.io/apply' />
        </Helmet>
        <ContentBlock
          background={ColorStyle.WHITE}
          title={
            <React.Fragment>
              <Box>You've been added to our waitlist.</Box>
            </React.Fragment>
          }
          bodyFirst={
            <React.Fragment>
              <Box>What happens next?</Box>
            </React.Fragment>
          }
          bodySecond={
            <React.Fragment>
              <Box>We'll watch your previous product reviews as soon as we can. If they match the vibe we're looking as one of our Ravebox trailblazers, you'll jump to the front of the waitlist. Aww yeah!</Box>
            </React.Fragment>
          }
        />
        <ContentBlock
          background={ColorStyle.SECONDARY}
          title={
            <React.Fragment>
              <Box>Have some friends that would make great ravers?</Box>
            </React.Fragment>
          }
          bodyFirst={
            <React.Fragment>
              <Box>Spread the word.</Box>
            </React.Fragment>
          }
          bodySecond={
            <React.Fragment>
              <Box className={clsx(classes.bodySpacing)}>Share the Ravebox waitlist and invite your friends to sign up.</Box>
              <ShareButton
                eventData={{ }}
                image={`/images/make-raves.png`}
                sharePath={`${process.env.RAZZLE_PUBLIC_PATH}/apply`}
                shareStyle={ShareStyle.BUTTON}
                shareType={ShareType.WAITLIST}
                title={`Join me on Ravebox. Where people want you to talk about products.`}
              />
            </React.Fragment>
          }
        />
      </Grid>
    </div>
  );
}

/**
 * Map the invitation request state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: InvitationRequestSuccessProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(InvitationRequestSuccess));

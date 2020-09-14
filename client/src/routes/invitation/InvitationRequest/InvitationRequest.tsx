/**
 * InvitationRequest.tsx
 * InvitationReqest route component.
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
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import ContentBlock from '../../../components/elements/contentBlock/ContentBlock';
import InvitationRequestForm from '../../../components/invitation/invitationRequestForm/InvitationRequestForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';
import { ColorStyle } from '../../../components/elements/contentBlock/ContentBlock.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  InvitationRequestProps,
} from './InvitationRequest.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formBackground: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(0, 0, 6)
    },
    formTitle: {
      color: theme.palette.primary.main,
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    heavy: {
      fontWeight: 700
    },
    primaryHighlight: {
      color: theme.palette.primary.main,
      fontWeight: 600
    }
  })
);

/**
 * InvitationRequest component.
 */
const InvitationRequest: React.FC<InvitationRequestProps> = (props: InvitationRequestProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles();

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
          title: 'Apply to join'
        },
        amplitude: {
          label: 'view join waitlist'
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
          <title>Apply to join the waitlist - Ravebox</title>
          <meta name='description' content={`Apply to join the Ravebox waitlist. Ravebox is a place to share videos videos talking about your experiences with products and become a trusted source for recommendations and advice.`} />
          <link rel='canonical' href='https://ravebox.io/apply' />
        </Helmet>
        <ContentBlock
          background={ColorStyle.WHITE}
          title={
            <React.Fragment>
              Want to join <Box component='span' className={clsx(
                classes.primaryHighlight
              )}>Ravebox</Box>?
            </React.Fragment>
          }
          bodyFirst={
            <React.Fragment>
              Great! We're just starting out so we have a <Box component='span' className={clsx(
                classes.heavy
              )}>waitlist</Box>.
            </React.Fragment>
          }
          bodySecond={
            <React.Fragment>
              Whilst we're not ready for thousands of people to be posting raves just yet, we are looking for Ravebox trailblazers.
            </React.Fragment>
          }
        />
        <ContentBlock
          background={ColorStyle.PRIMARY}
          title={
            <React.Fragment>
              Who is a <Box component='span' className={clsx(
                classes.heavy
              )}>Ravebox trailblazer</Box>?
            </React.Fragment>
          }
          bodyFirst={
            <React.Fragment>
              As a Ravebox trailblazer, you'll be the first to post creative, authentic raves and define the vibe of Ravebox for years to come.
            </React.Fragment>
          }
          bodySecond={
            <React.Fragment>
              You'll also be the first to build your channel and create a following of people looking to you for recommendations and advice.
            </React.Fragment>
          }
        />
        <ContentBlock
          background={ColorStyle.WHITE}
          reducedBottomMargin={true}
          title={
            <React.Fragment>
              <Box component='span' className={clsx(
                classes.heavy
              )}>Want to be a trailblazer?</Box>
            </React.Fragment>
          }
          bodyFirst={
            <React.Fragment>
              If you want to be the first on Ravebox, include a link to your best social profile and join our waitlist!
            </React.Fragment>
          }
        />
      </Grid>
      <Grid item xs={12} className={clsx(classes.formBackground)}>
        <Typography variant='h2' className={clsx(classes.formTitle)}>
          Join the Ravebox waitlist
        </Typography>
        <InvitationRequestForm />
      </Grid>
    </div>
  );
}

/**
 * Map the invitation request state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: InvitationRequestProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(InvitationRequest));

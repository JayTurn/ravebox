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
import InvitationRequestForm from '../../../components/invitation/invitationRequestForm/InvitationRequestForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';

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
          path: props.location.pathname,
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
        <PageTitle title='Thanks for applying' />
        <Grid item xs={12} lg={9} className={clsx(classes.padding)}>
          <Typography variant='h2' className={clsx(classes.heading)} style={{marginTop: 0}}>
            What happens next?
          </Typography>
          <Typography variant='body1' className={clsx(classes.paragraph)}>
            You've been added to our waitlist. If you provided a link to your previous product reviews, we'll watch them as soon as we can. If they match the Ravebox vibe we're looking for, you'll jump to the front of the waitlist. 
          </Typography>
          <Typography variant='body1' className={clsx(classes.paragraph)}>
            When we're ready to invite you, we'll send you an email with a link to join. Once you've signed up, you can start posting raves right away. Aww yeah! 
          </Typography>
          <Typography variant='h3' className={clsx(classes.subHeading)}>
            Is there another way to join?
          </Typography>
          <Typography variant='body1' className={clsx(classes.paragraph)}>
            Now that you mention it, we provide every raver with two invitations for their friends. If you know someone with an invitation, you could promise to do their washing for a week if they invite you... or you could just ask nicely.
          </Typography>
          <Typography variant='body1' className={clsx(classes.paragraph)}>
            It's up to you.
          </Typography>
        </Grid>
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

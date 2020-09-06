/**
 * ReviewCard.tsx
 * Card display of the review.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { NavLink } from 'react-router-dom';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import LinkElement from '../../elements/link/Link';
import ReviewCardProfile from '../reviewCardProfile/ReviewCardProfile';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { ReviewCardProps } from './ReviewCard.interface';

// Utilities.
import { formatReviewForTracking } from '../Review.common';

/**
 * Card header styles.
 */
const StyledCardHeader = withStyles(theme => ({
  root: {
    maxWidth: '100%'
  },
  content: {
    maxWidth: '100%'
  },
  title: {
    maxWidth: '100%'
  }
}))(CardHeader);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatarIcon: {
      backgroundColor: theme.palette.common.white,
      border: `1px solid ${theme.palette.grey.A200}`,
      color: theme.palette.grey.A700,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(4),
      width: theme.spacing(4)
    },
    brandText: {
      display: 'block',
      fontSize: '.9rem',
      fontWeight: 500
    },
    cardContainer: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      boxShadow: 'none',
      padding: theme.spacing(2, 0)
    },
    cardContainerLarge: {
      padding: 0
    },
    cardHeaderContent: {
      marginBottom: theme.spacing(1),
      maxWidth: '100%',
      padding: theme.spacing(0, 2)
    },
    cardHeaderContentLarge: {
      padding: 0
    },
    divider: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    handleText: {
      display: 'block',
      fontSize: '.7rem',
      fontWeight: 700,
    },
    linkText: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },
    media: {
      paddingTop: '56.25%'
    },
    menuIcon: {
      paddingRight: 0,
      paddingBottom: 0,
      '&:hover': {
        backgroundColor: 'transparent'
      }
    },
    productNameSpan: {
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    productNameText: {
      fontSize: '1.02rem',
      fontWeight: 500,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    reviewLinkButton: {
      border: `1px solid ${theme.palette.secondary.light}`,
      padding: 4,
      '&:hover': {
        backgroundColor: 'rgba(8, 203, 175, 0.1)'
      }
    },
    reviewLinkIcon: {
      fontSize: 27
    },
    textContent: {
      //borderLeft: `3px solid ${theme.palette.secondary.main}`,
      padding: theme.spacing(2),
      '&:last-child': {
        paddingBottom: theme.spacing(1),
      }
    },
    textContentLarge: {
      padding: theme.spacing(2, 0)
    },
    title: {
      fontSize: '.95rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    titleContainer: {
      padding: theme.spacing(1, 0, 0)
    },
    userStatisticsText: {
    }
  }),
);

/**
 * Returns the statistics for display in the profile.
 */

/**
 * Review card for public display.
 */
const ReviewCard: React.FC<ReviewCardProps> = (props: ReviewCardProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the style classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  /**
   * Tracks the review card navigation event.
   */
  const handleNavigation: (
  ) => void = (
  ): void => {

    // Format the review for tracking.
    const data: EventObject = formatReviewForTracking(props.context)(props);

    // Track the select event.
    analytics.trackEvent('select review')(data);
  }

  const firstLetter: string = props.user ? props.user.handle.substr(0,1) : 'r';

  return (
    <Card className={clsx(
      classes.cardContainer,
      {
        [classes.cardContainerLarge]: largeScreen
      }
      )}
    >
      <StyledCardHeader
        className={clsx(classes.cardHeaderContent, {
          [classes.cardHeaderContentLarge]: largeScreen
        })}
        style={{maxWidth: '100%'}}
        title={
          <Grid
            container
            direction='column'
          >
            {props.user &&
              <ReviewCardProfile
                context={props.context}  
                review={{...props}}
                user={props.user}
                url={props.url}
              />
            }
            <Grid item xs={12} className={clsx(classes.titleContainer)}>
              <NavLink
                className={classes.linkText}
                onClick={handleNavigation}
                to={`/review/${props.url}`}
              >
                <Typography variant='body2' className={classes.title}>
                  {props.title} 
                </Typography>
              </NavLink>
            </Grid>
          </Grid>
        }
      />
      <NavLink
        className={classes.linkText}
        onClick={handleNavigation}
        to={`/review/${props.url}`}
      >
        <CardMedia
          className={clsx(classes.media)}
          image={props.thumbnail}
          src='/images/placeholder.png'
          title={`${props.product ? props.product.name : ''} review`}
        />
      </NavLink>
      <CardContent className={clsx(classes.textContent, {
          [classes.textContentLarge]: largeScreen
        })}
      >
        <Grid container direction='row' style={{flexWrap: 'nowrap', maxWidth: '100%'}}>
          {props.product &&
            <Grid item style={{flexGrow: 1, minWidth: 0}}>
              <NavLink
                className={classes.linkText}
                onClick={handleNavigation}
                to={`/review/${props.url}`}
              >
                <Typography variant='body2' className={classes.productNameText}>
                  <Box component='span' className={classes.brandText}>{props.product.brand}</Box> {props.product.name}
                </Typography>
              </NavLink>
            </Grid>
          }
          <Grid item style={{flexGrow: 0, marginLeft: theme.spacing(1)}}>
            <NavLink
              className={classes.linkText}
              onClick={handleNavigation}
              to={`/review/${props.url}`}
            >
              <IconButton className={classes.reviewLinkButton}>
                <PlayArrowRoundedIcon color='secondary' className={classes.reviewLinkIcon} />
              </IconButton>
            </NavLink>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ReviewCard;

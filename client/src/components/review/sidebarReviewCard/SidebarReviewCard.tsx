/**
 * SidebarReviewCard.tsx
 * Card display of the review positioned in the sidebar.
 */

// Modules.
import * as React from 'react';
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
import Link from '@material-ui/core/Link';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { NavLink } from 'react-router-dom';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import LinkElement from '../../elements/link/Link';

// Enumerators.
import { ReviewListType } from '../listByQuery/ListByQuery.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { SidebarReviewCardProps } from './SidebarReviewCard.interface';

// Utilities.
import { formatReviewForTracking } from '../Review.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    analyticText: {
      fontSize: '.9rem',
      fontWeight: 500,
    },
    brandText: {
      display: 'block',
      fontSize: '.9rem',
      fontWeight: 500
    },
    cardContainer: {
      borderRadius: 0,
      boxShadow: 'none',
      backgroundColor: 'transparent'
    },
    cardHeaderContent: {
      marginBottom: theme.spacing(1),
      maxWidth: '100%',
      padding: theme.spacing(0, 0, 0, 1)
    },
    cardHeaderContentLarge: {
      padding: 0
    },
    contentContainer: {
    },
    flexContainer: {
      alignItems: 'flex-start',
      display: 'flex',
      justifyContent: 'flex-start',
      padding: theme.spacing(1, 2),
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: `rgba(0,0,0,0.03)`
      }
    },
    mediaContainer: {
      width: `100%`,
      maxWidth: 170,
      minWidth: 170,
      height: 'calc(100% * 0.56)',
      overflow: 'hidden'
    },
    divider: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    handleText: {
      display: 'block',
      fontSize: '.8rem',
      fontWeight: 500,
      marginTop: theme.spacing(1)
    },
    linkText: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },
    media: {
      height: 140
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
    titleText: {
      fontSize: '.9rem',
      lineHeight: '1rem',
      fontWeight: 700,
      display: `-webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2`,
      maxHeight: '2rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
    }
  }),
);

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
 * Review card for public display.
 */
const SidebarReviewCard: React.FC<SidebarReviewCardProps> = (props: SidebarReviewCardProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the style classes.
  const classes = useStyles(),
        theme = useTheme()

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

  return (
    <Card className={classes.cardContainer}>
      <NavLink
        className={classes.flexContainer}
        onClick={handleNavigation}
        to={`/review/${props.url}`}
      >
        <Box className={classes.mediaContainer}>
          <CardMedia
            className={clsx(classes.media)}
            image={props.thumbnail}
            src='/images/placeholder.png'
            title={`${props.product ? props.product.name : ''} review`}
          />
        </Box>
        <Box className={classes.contentContainer}>
          <StyledCardHeader
            className={clsx(classes.cardHeaderContent)}
            style={{maxWidth: '100%'}}
            title={
              <Grid container direction='column'>
                <Grid item style={{minWidth: 0}}>
                  <Typography variant='body1' className={classes.titleText}>
                    {props.title} 
                  </Typography>
                </Grid>
                {props.user &&
                  <Grid item>
                    <Typography variant='body1' className={classes.handleText}>
                      {props.user.handle} 
                    </Typography>
                  </Grid>
                }
              </Grid>
            }
          />
        </Box>
        {props.listType !== ReviewListType.PRODUCT &&
          <CardContent className={clsx(classes.textContent)}
          >
            <Grid container direction='row' style={{flexWrap: 'nowrap', maxWidth: '100%'}}>
              {props.product &&
                <Grid item style={{flexGrow: 1, minWidth: 0}}>
                  <Typography variant='body2' className={classes.productNameText}>
                    <Box component='span' className={classes.brandText}>{props.product.brand}</Box> {props.product.name}
                  </Typography>
                </Grid>
              }
            </Grid>
          </CardContent>
        }
      </NavLink>
    </Card>
  );
}

export default SidebarReviewCard;

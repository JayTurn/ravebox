/**
 * PrivateReviewCard.tsx
 * Card display of the private review.
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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { NavLink } from 'react-router-dom';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import LinkElement from '../../elements/link/Link';
import PrivateReviewMenu from '../privateReviewMenu/PrivateReviewMenu';

// Enumerators.
import { Workflow } from '../../../utils/workflow/Workflow.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { PrivateReviewCardProps } from './PrivateReviewCard.interface';

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
    brandText: {
      display: 'block',
      fontSize: '.9rem',
      fontWeight: 500
    },
    cardContainer: {
      backgroundColor: 'transparent',
      borderRadius: 0,
      boxShadow: 'none',
      padding: theme.spacing(2, 0),
      position: 'relative',
      zIndex: 1
    },
    cardHeaderContent: {
      marginBottom: theme.spacing(1),
      maxWidth: '100%',
      padding: theme.spacing(0, 2)
    },
    cardHeaderContentLarge: {
      padding: 0
    },
    disableNavigate: {
      cursor: 'auto'
    },
    divider: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    draftCard: {
      backgroundColor: `rgba(0,0,0,0.1)`,
      height: '100%',
      position: 'absolute',
      width: '100%',
      zIndex: 2
    },
    draftCardContainer: {
      height: '100%'
    },
    draftCardContent: {
      alignItems: 'center',
      height: '100%',
      display: 'flex'
    },
    draftCardText: {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white,
      borderRadius: 12,
      border: `2px solid ${theme.palette.primary.main}`,
      fontSize: '.8rem',
      fontWeight: 700,
      padding: theme.spacing(1, 2),
      textTransform: 'uppercase'
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
    mediaLink: {
      position: 'relative',
      display: 'block'
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
      fontSize: 30
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
      fontSize: '1rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }),
);

/**
 * Private review card with editable options.
 */
const PrivateReviewCard: React.FC<PrivateReviewCardProps> = (props: PrivateReviewCardProps) => {

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
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    if (props.published !== Workflow.PUBLISHED) {
      e.preventDefault();
      return;
    }

    // Format the review for tracking.
    const data: EventObject = formatReviewForTracking(props.context)(props);

    // Track the select event.
    analytics.trackEvent('select review')(data);
  }

  return (
    <Card className={clsx(classes.cardContainer)}
    >
      <StyledCardHeader
        className={clsx(classes.cardHeaderContent, {
          [classes.cardHeaderContentLarge]: largeScreen
        })}
        style={{maxWidth: '100%'}}
        title={
          <Grid container direction='row' style={{flexWrap: 'nowrap', maxWidth: '100%'}}>
            <Grid item style={{flexGrow: 1, minWidth: 0}}>
              <NavLink
                className={clsx(
                  classes.linkText,
                  {
                    [classes.disableNavigate]: props.published !== Workflow.PUBLISHED
                  }
                )}
                onClick={handleNavigation}
                to={`/review/${props.url}`}
              >
                {props.user &&
                  <Typography variant='body2' className={classes.title}>
                    <Box component='span' className={classes.handleText}>{props.user.handle}</Box> {props.title} 
                  </Typography>
                }
              </NavLink>
            </Grid>
            <Grid item style={{flexGrow: 0}}>
              <PrivateReviewMenu
                paths={{
                  edit: `/review/edit/${props._id}`
                }}
                productTitle={props.product ? props.product.name : ''}
                reviewId={props._id}
              />
            </Grid>
          </Grid>
        }
      />
      <NavLink
        className={clsx(
          classes.linkText,
          classes.mediaLink,
          {
            [classes.disableNavigate]: props.published !== Workflow.PUBLISHED
          }
        )}
        onClick={handleNavigation}
        to={`/review/${props.url}`}
      >
        {props.published === Workflow.DRAFT &&
          <Box className={classes.draftCard}>
            <Grid
              alignItems='center'
              container
              direction='column'
              className={classes.draftCardContainer}
            >
              <Grid
                className={classes.draftCardContent}
                item
                xs={12}
              >
                <Typography variant='body1' className={classes.draftCardText}>
                  Processing...
                </Typography>
              </Grid>
            </Grid>
          </Box>
        }
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
                className={clsx(
                  classes.linkText,
                  {
                    [classes.disableNavigate]: props.published !== Workflow.PUBLISHED
                  }
                )}
                onClick={handleNavigation}
                to={`/review/${props.url}`}
              >
                <Typography variant='body2' className={classes.productNameText}>
                  <Box component='span' className={classes.brandText}>{props.product.brand}</Box> {props.product.name}
                </Typography>
              </NavLink>
            </Grid>
          }
          {props.published === Workflow.PUBLISHED &&
            <Grid item style={{flexGrow: 0, marginLeft: theme.spacing(1)}}>
              <NavLink
                className={clsx(
                  classes.linkText,
                  {
                    [classes.disableNavigate]: props.published !== Workflow.PUBLISHED
                  }
                )}
                onClick={handleNavigation}
                to={`/review/${props.url}`}
              >
                <IconButton className={clsx(
                  classes.reviewLinkButton
                )}>
                  <PlayArrowRoundedIcon color='secondary' className={classes.reviewLinkIcon} />
                </IconButton>
              </NavLink>
            </Grid>
          }
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PrivateReviewCard;

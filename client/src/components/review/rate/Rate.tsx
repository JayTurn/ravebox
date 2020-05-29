/**
 * Rate.tsx
 * Renders the rating component for reviews.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import * as React from 'react';
import ThumbUpAltRoundedIcon from '@material-ui/icons/ThumbUpAltRounded';
import ThumbDownAltRoundedIcon from '@material-ui/icons/ThumbDownAltRounded';
import Typography from '@material-ui/core/Typography';

// Enumerators.
import { Rating } from './Rate.enum';
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';
import { useRate } from './useRate.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { RateProps } from './Rate.interface';

// Utilities.
import { formatReviewProperties } from '../Review.common';

/**
 * Styles for the wrapping button element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(1, 0),
    overflow: 'hidden',
    flexWrap: 'nowrap'
  },
  countText: {
    color: theme.palette.grey.A700,
    fontSize: '1rem',
    fontWeight: 700
  },
  countTextContainer: {
    textAlign: 'center'
  },
  icon: {
    '&:hover': {
      color: theme.palette.primary.main
    } 
  },
  iconButton: {
    cursor: 'pointer',
    padding: theme.spacing(0, 1, .5),
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  iconRow: {
    justifyContent: 'space-between'
  },
  iconUp: {
  },
  popoverActionContainer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  popoverButton: {
  },
  popoverContainer: {
  },
  popoverPadding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  popoverTextContainer: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  popoverTitle: {
    fontSize: '1.15rem'
  },
  popoverText: {
    fontSize: '.9rem'
  },
  ratingItem: {
    flexWrap: 'nowrap',
    justifyContent: 'center'
  },
  ratingItemContainer: {
    '&:first-child': {
      marginRight: theme.spacing(3)
    }
  },
  ratingItemLabel: {
    color: theme.palette.grey.A700,
    fontSize: '.7rem',
    fontWeight: 600,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  ratingItemWithValues: {
    justifyContent: 'flex-start'
  },
  selectedIcon: {
    color: theme.palette.primary.main
  },
  selectedText: {
    color: theme.palette.primary.main
  }
}));

/**
 * Renders the component to rate a review.
 *
 * @param { RateProps } props - the rating properties.
 */
const Rate: React.FC<RateProps> = (props: RateProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Use the custom styles.
  const classes = useStyles();

  const {
    ratingResults,
    rate,
    retrieved,
    setRatingResults
  } = useRate({reviewId: props.review._id});

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [open, setOpen] = React.useState<boolean>(false);

  const [eventData, setEventData] = React.useState<EventObject>(
          formatReviewProperties({...props.review}));

  /**
   * Handles the upvote event.
   */
  const handleUpvote: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // Check if we're allowed to rate.
    if (!props.acceptance.allowed) {
      // Trigger the display of the minimum duration message.
      setAnchorEl(e.currentTarget);
      setOpen(true);

      // Track the failed attempt to rate the review.
      trackRating(Rating.HELPFUL);
      return;
    }

    if (props.token) {
      rate(Rating.HELPFUL)(props.token);

      // Track the successful attempt to rate the review.
      trackRating(Rating.HELPFUL);
    }
  }

  /**
   * Handles the down vote event.
   */
  const handleDownvote: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // Check if we're allowed to rate.
    if (!props.acceptance.allowed) {
      // Trigger the display of the minimum duration message.
      setAnchorEl(e.currentTarget);
      setOpen(true);

      // Track the failed attempt to rate the review.
      trackRating(Rating.UNHELPFUL);

      return;
    }

    if (props.token) {
      rate(Rating.UNHELPFUL)(props.token);

      // Track the successful attempt to rate the review.
      trackRating(Rating.UNHELPFUL);
    }
  }

  /**
   * Handles the closing of the popover message.
   */
  const handlePopoverClose: (
  ) => void = (
  ): void => {
    setOpen(false);
    setAnchorEl(null)
  }

  /**
   * Handles the tracking event.
   */
  const trackRating: (
    rating: Rating
  ) => void = (
    rating: Rating
  ): void => {
    const data: EventObject = {...eventData};

    data['rating allowed'] = props.acceptance.allowed;
    data['rating'] = rating;
    data['watched seconds'] = props.acceptance.playedSeconds
    data['watched percentage'] = props.acceptance.played

    analytics.trackEvent('rate review')(data);
  }

  return (
    <Grid container direction='column'>
      <Grid item>
        <Grid container direction='row' className={clsx(classes.container)}>
          <Grid item className={clsx(classes.ratingItemContainer)}>
            <Grid container direction='row' className={clsx(
              classes.ratingItem,
              {
                [classes.ratingItemWithValues]: ratingResults.up !== '0'
              }
            )}>
              <Grid item>
                <IconButton
                  className={clsx(
                    classes.iconButton,
                    {
                      [classes.selectedIcon]: ratingResults.userRating === Rating.HELPFUL
                    }
                  )}
                  onClick={handleUpvote}
                >
                  <ThumbUpAltRoundedIcon className={clsx(classes.icon)}/>
                </IconButton>
              </Grid>
              {ratingResults && ratingResults.up !== '0' &&
                <Grid item className={clsx(
                    classes.ratingItem,
                    classes.countTextContainer
                  )}
                >
                  <Typography variant='body1' className={clsx(
                      classes.countText,
                      {
                        [classes.selectedText]: ratingResults.userRating === Rating.HELPFUL
                      }
                    )}
                  >
                    {ratingResults.up}
                  </Typography>
                </Grid>
              }
            </Grid>
            <Grid item>
              <Typography variant='body1' className={clsx(classes.ratingItemLabel)}>
                Helpful
              </Typography>
            </Grid>
          </Grid>
          <Grid item className={clsx(classes.ratingItemContainer)}>
            <Grid container direction='row' className={clsx(
              classes.ratingItem,
              {
                [classes.ratingItemWithValues]: ratingResults.down !== '0'
              }
            )}>
              <Grid item>
                <IconButton
                  className={clsx(
                    classes.iconButton,
                    {
                      [classes.selectedIcon]: ratingResults.userRating === Rating.UNHELPFUL
                    }
                  )}
                  onClick={handleDownvote}
                >
                  <ThumbDownAltRoundedIcon className={clsx(classes.icon)}/>
                </IconButton>
              </Grid>
              {ratingResults && ratingResults.down !== '0' &&
                <Grid item className={clsx(
                    classes.ratingItem,
                    classes.countTextContainer
                  )}
                >
                  <Typography variant='body1' className={clsx(
                      classes.countText,
                      {
                        [classes.selectedText]: ratingResults.userRating === Rating.UNHELPFUL
                      }
                    )}
                  >
                    {ratingResults.down}
                  </Typography>
                </Grid>
              }
            </Grid>
            <Grid item>
              <Typography variant='body1' className={clsx(classes.ratingItemLabel)}>
                Unhelpful
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Popover
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          className={clsx(classes.popoverContainer)}
          open={open} 
          onClose={handlePopoverClose}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Grid container direction='column'>
            <Grid item className={clsx(
                classes.popoverPadding,
                classes.popoverTextContainer
              )}
            >
              <Typography variant='h2' className={clsx(classes.popoverTitle)}>
                Was this rave helpful?
              </Typography>
              <Typography variant='body1' component='p' className={clsx(classes.popoverText)}>
                Please watch the entire rave before you rate it
              </Typography>
            </Grid>
            <Grid item className={clsx(
                classes.popoverPadding,
                classes.popoverActionContainer
              )}
            >
              <Button
                color='primary'
                disableElevation
                onClick={handlePopoverClose}
                size='small'
                title='Ok'
                variant='contained'
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </Popover>
      </Grid>
    </Grid>
  );
}

export default Rate;

/**
 * ShareButton.tsx
 * Renders the share button component based on compatibility.
 */

// Modules.
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  WeiboShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  EmailIcon,
  WeiboIcon,
} from "react-share";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import * as React from 'react';
import ShareRoundedIcon from '@material-ui/icons/ShareRounded';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Enumerators.
import {
  ShareStyle,
  ShareType
} from './ShareButton.enum';

// Hooks.
import { useAnalytics } from '../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../analytics/Analytics.interface';
import { ShareButtonProps } from './ShareButton.interface';

// Utilities.
import { formatReviewProperties } from '../review/Review.common';

/**
 * Share button styles.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  button: {
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
  popoverActionContainer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  popoverActionButtonContainer: {
    justifyContent: 'space-between'
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
    paddingBottom: theme.spacing(0),
    paddingTop: theme.spacing(2)
  },
  popoverTitle: {
    fontSize: '1.15rem'
  },
  popoverText: {
    fontSize: '.9rem'
  },
  shareContainer: {
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 0)
  },
  shareItem: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'center'
  },
  shareItemContainer: {
  },
  shareText: {
    color: theme.palette.grey.A700,
    fontSize: '.7rem',
    fontWeight: 600,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  shareTextContainer: {
    textAlign: 'center'
  },
}));

const StyledButton = withStyles(theme => ({
  root: {
    color: theme.palette.secondary.dark,
    cursor: 'pointer',
    fontSize: '.9rem',
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.secondary.dark,
      backgroundColor: theme.palette.common.white,
      opacity: .9
    },
    '&:disabled': {
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.common.white,
      opacity: '.45'
    }
  },
  label: {
    fontWeight: 600
  }
}))(Button);

/**
 * Determines if we can share using the navigator object.
 */
const isSupported: (
) => boolean = (
): boolean => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  if ((navigator as any).share) {
    return true;
  } else {
    return false;
  }
}

/**
 * Webshare button.
 */
const ShareButton: React.FC<ShareButtonProps> = (props: ShareButtonProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Use the custom styles.
  const classes = useStyles(),
        theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [open, setOpen] = React.useState<boolean>(false);

  const path: string = props.sharePath ? props.sharePath : `${process.env.RAZZLE_PUBLIC_PATH}${props.location.pathname}`;

  const navigatorSupported: boolean = isSupported();

  //const [eventData, setEventData] = React.useState<EventObject>(
          //formatReviewProperties({...props.review}));

  const handleNavigatorShare: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation();
    if (isSupported()) {
      try {
        (navigator as any).share({
          title: props.title,
          url: path
        })
        .then(() => {
          trackShare('native');
        })
        .catch((error: Error) => {
          console.log(error);
        });
      } catch {
        console.log('Failed to share via navigator');
      }
    }
  }

  /**
   * Handles the desktop share button.
   */
  const handleDesktopShare: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.stopPropagation();
    // Trigger the display of the minimum duration message.
    setAnchorEl(e.currentTarget);
    setOpen(true);
    trackShare('web');
  };

  /**
   * Handles mouse down and mouse up events to stop proagation.
   */
  const handleMouse: (
    e: React.MouseEvent
  ) => void = (
    e: React.MouseEvent
  ): void => {
    e.stopPropagation();
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
   * Tracks the share event.
   */
  const trackShare: (
    shareMedium: string
  ) => void = (
    shareMedium: string
  ): void => {
    const data: EventObject = {...props.eventData};

    data['share medium'] = shareMedium;

    analytics.trackEvent(`share ${props.shareType}`)(data);
  }

  return (
    <Grid container direction='column' className={clsx(
      classes.shareItem,
      classes.shareItemContainer
    )}>
      {props.shareStyle === ShareStyle.BUTTON &&
        <React.Fragment>
          <Grid item>
            <StyledButton
              className={clsx(classes.button)}
              color='primary'
              disableElevation
              onClick={navigatorSupported ? handleNavigatorShare : handleDesktopShare}
              onMouseDown={handleMouse}
              onMouseUp={handleMouse}
              startIcon={<ShareRoundedIcon />}
              variant='contained'
            >
              Share
            </StyledButton>
          </Grid>
        </React.Fragment>
      }
      {props.shareStyle === ShareStyle.ICON &&
        <React.Fragment>
          <Grid item>
            <IconButton
              className={clsx(
                classes.iconButton
              )}
              onClick={navigatorSupported ? handleNavigatorShare : handleDesktopShare}
              onMouseDown={handleMouse}
              onMouseUp={handleMouse}
            >
              <ShareRoundedIcon className={clsx(classes.icon)} style={{color: props.color || theme.palette.grey.A700}}/>
            </IconButton>
          </Grid>
          <Grid item className={clsx(
              classes.shareItem,
              classes.shareTextContainer
            )}
          >
            <Typography
              variant='body1' 
              className={clsx(
                classes.shareText
              )}
              style={{color: props.color || theme.palette.grey.A700}}
            >
              Share
            </Typography>
          </Grid>
        </React.Fragment>
      }
      {!navigatorSupported &&
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
                Share
              </Typography>
            </Grid>
            <Grid item className={clsx(
                classes.popoverPadding
              )}
            >
              <Grid
                container
                direction='row'
                spacing={1}
                className={clsx(
                  classes.shareContainer
                )}
              >
                <Grid item>
                  <TwitterShareButton
                    url={path}
                    title={props.title}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </Grid>
                <Grid item>
                  <LinkedinShareButton
                    url={path}
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                </Grid>
                <Grid item>
                  <FacebookShareButton
                    url={path}
                    quote={props.title}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </Grid>
                <Grid item>
                  <RedditShareButton
                    url={path}
                    title={props.title}
                  >
                    <RedditIcon size={32} round />
                  </RedditShareButton>
                </Grid>
                <Grid item>
                  <TumblrShareButton
                    url={path}
                    title={props.title}
                  >
                    <TumblrIcon size={32} round />
                  </TumblrShareButton>
                </Grid>
                <Grid item>
                  <WeiboShareButton
                    url={path}
                    title={props.title}
                    image={props.image ? props.image : ''}
                  >
                    <WeiboIcon size={32} round />
                  </WeiboShareButton>
                </Grid>
                <Grid item>
                  <WhatsappShareButton
                    url={path}
                    separator=':: '
                    title={props.title}
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </Grid>
                <Grid item>
                  <TelegramShareButton
                    url={path}
                    title={props.title}
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                </Grid>
                <Grid item>
                  <EmailShareButton
                    url={path}
                    subject={props.title}
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={clsx(
                classes.popoverPadding,
                classes.popoverActionContainer
              )}
            >
              <Grid
                container
                direction='row'
                className={clsx(
                  classes.popoverActionButtonContainer
                )}
              >
                <Grid item>
                  <Button
                    color='primary'
                    disableElevation
                    onClick={handlePopoverClose}
                    size='small'
                    title='Close'
                    variant='outlined'
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Popover>
      }
    </Grid>
  )
};

export default withRouter(ShareButton);

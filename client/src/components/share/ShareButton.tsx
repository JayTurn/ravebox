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
  useTheme
} from '@material-ui/core/styles';
import {
  FacebookShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  PocketShareButton,
  InstapaperShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  WeiboIcon,
} from "react-share";
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import * as React from 'react';
import ShareRoundedIcon from '@material-ui/icons/ShareRounded';
import Typography from '@material-ui/core/Typography';
import webShare, { WebShareInterface } from 'react-web-share-api';

// Interfaces.
import { ShareButtonProps } from './ShareButton.interface';

/**
 * Share button styles.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
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
    padding: theme.spacing(0, 2),
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

/**
 * Webshare button.
 */
const ShareButton: React.StatelessComponent<WebShareInterface & ShareButtonProps> = ({
  share,
  isSupported,
  title,
  url,
  image
}) => {
  // Use the custom styles.
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Handles the desktop share button.
   */
  const handleDesktopShare: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // Trigger the display of the minimum duration message.
    setAnchorEl(e.currentTarget);
    setOpen(true);
  };

  /**
   * Handles the closing of the popover message.
   */
  const handlePopoverClose: (
  ) => void = (
  ): void => {
    setOpen(false);
    setAnchorEl(null)
  }

  return (
    <Grid container direction='column' className={clsx(
      classes.shareItem,
      classes.shareItemContainer
    )}>
      <Grid item>
        <IconButton
          className={clsx(
            classes.iconButton
          )}
          onClick={isSupported ? share : handleDesktopShare}
        >
          <ShareRoundedIcon className={clsx(classes.icon)} />
        </IconButton>
      </Grid>
      <Grid item className={clsx(
          classes.shareItem,
          classes.shareTextContainer
        )}
      >
        <Typography variant='body1' className={clsx(
            classes.shareText
          )}
        >
          Share
        </Typography>
      </Grid>
      {!isSupported &&
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
                    url={url}
                    title={title}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </Grid>
                <Grid item>
                  <LinkedinShareButton
                    url={url}
                  >
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                </Grid>
                <Grid item>
                  <FacebookShareButton
                    url={url}
                    quote={title}
                  >
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                </Grid>
                <Grid item>
                  <RedditShareButton
                    url={url}
                    title={title}
                  >
                    <RedditIcon size={32} round />
                  </RedditShareButton>
                </Grid>
                <Grid item>
                  <TumblrShareButton
                    url={url}
                    title={title}
                  >
                    <TumblrIcon size={32} round />
                  </TumblrShareButton>
                </Grid>
                <Grid item>
                  <WeiboShareButton
                    url={url}
                    title={title}
                    image={image ? image : ''}
                  >
                    <WeiboIcon size={32} round />
                  </WeiboShareButton>
                </Grid>
                <Grid item>
                  <WhatsappShareButton
                    url={url}
                    separator=':: '
                    title={title}
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </Grid>
                <Grid item>
                  <TelegramShareButton
                    url={url}
                    title={title}
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                </Grid>
                <Grid item>
                  <EmailShareButton
                    url={url}
                    subject={title}
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

export default webShare<ShareButtonProps>()(ShareButton);

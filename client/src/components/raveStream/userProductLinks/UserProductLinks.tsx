/**
 * UserProductLinks.tsx
 * User product links.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Enumerators.
import { Role } from '../../user/User.enum';

// Interfaces.
import { UserProductLinksProps } from './UserProductLinks.interface';
import { ReviewLink } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buyLink: {
      fontSize: '1rem',
      wordBreak: 'break-all'
    },
    buyButtonContainer: {
      margin: theme.spacing(2, 2, 0),
    },
    container: {
      padding: theme.spacing(0, 2)
    },
    contentContainer: {
      lineHeight: '1rem',
    },
    contentContainerSmall: {
      display: `-webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 5`,
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      overflow: 'hidden',
    },
    helperText: {
      fontSize: '.7rem',
      margin: theme.spacing(2, 0),
    },
    paddedContainer: {
      padding: theme.spacing(0, 2)
    },
    linkInfoContainer: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(0, 2)
    },
    paragraph: {
      fontSize: '1rem',
      marginTop: theme.spacing(2),
    },
    promoCode: {
      fontSize: '1rem',
      fontWeight: 700,
      marginTop: theme.spacing(1)
    },
    showMoreLink: {
      fontSize: '.8rem',
      fontWeight: 500,
      margin: theme.spacing(2, 0, 3),
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    titleContainer: {
      margin: theme.spacing(2, 2, 0),
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 800
    }
  })
);

/**
 * Renders the product images.
 */
const UserProductLinks: React.FC<UserProductLinksProps> = (props: UserProductLinksProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Set an expanded state for the description content.
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const user: string = props.user
    ? props.user.handle
    : 'the user';

  const reviewLink: ReviewLink | null = props.reviewLinks && props.reviewLinks.length > 0
    ? props.reviewLinks[0] : null;

  return (
    <Grid container>
      {reviewLink && reviewLink.path &&
        <React.Fragment>
          <Grid item xs={12}>
            <Box className={clsx(classes.titleContainer)}>
              <Typography variant='body1' className={clsx(classes.title)}>
                Where to buy
              </Typography>
            </Box>
          </Grid>
          {reviewLink.code &&
            <Grid item xs={12} className={clsx(classes.paddedContainer)}>
              <Typography variant='body1' className={clsx(classes.promoCode)}>
                PROMO CODE: {reviewLink.code}
              </Typography>
            </Grid>
          }
          {reviewLink.info &&
            <Grid item xs={12} className={clsx(classes.linkInfoContainer)}>
              {reviewLink.info.split('\n').map((item: string, index: number) => {
                if (item) {
                  return (
                    <Typography
                      className={clsx(classes.paragraph)}
                      component='p'
                      key={index}
                      variant='body1' 
                    >
                      {item}
                    </Typography>
                  );
                }
              })}
            </Grid>
          }
          <Grid item xs={12} className={clsx(classes.buyButtonContainer)}>
            <Link
              className={clsx(classes.buyLink)}
              href={`https://${reviewLink.path}`} 
              target='_blank'
            >
              {`https://${reviewLink.path}`}
            </Link>
          </Grid>
          <Grid item xs={12} className={clsx(classes.paddedContainer)}>
            <Typography
              className={clsx(classes.helperText)}
              component='p'
              variant='body1' 
            >
              *The above link has been provided by {user} and is not affiliated with Ravebox
            </Typography>
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
};

export default UserProductLinks;

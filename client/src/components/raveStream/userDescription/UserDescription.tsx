/**
 * UserDescription.tsx
 * Product images component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import { UserDescriptionProps } from './UserDescription.interface';
import { ReviewLink } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buyButton: {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 6,
      color: theme.palette.common.white,
      display: 'inline-block',
      fontSize: '.9rem',
      fontWeight: 600,
      padding: theme.spacing(1, 3),
      textTransform: 'uppercase',
      '&:hover': {
        textDecoration: 'none'
      }
    },
    buyButtonContainer: {
      margin: theme.spacing(2, 0),
      textAlign: 'center'
    },
    container: {
      padding: theme.spacing(2),
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
    paragraph: {
      fontSize: '1rem',
      marginBottom: theme.spacing(1),
    },
    showMoreLink: {
      fontSize: '.8rem',
      fontWeight: 500,
      margin: theme.spacing(0, 0, 2),
      padding: theme.spacing(0, 2),
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    titleContainer: {
      margin: theme.spacing(2, 2, 0),
    },
    title: {
      fontSize: '1.1rem',
      fontWeight: 800
    },
    leftAlign: {
      textAlign: 'left'
    },
  })
);

/**
 * Renders the user description component.
 */
const UserDescription: React.FC<UserDescriptionProps> = (props: UserDescriptionProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Set an expanded state for the description content.
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const title: string = props.user 
    ? `About ${props.user.handle}`
    : `About`;

  const about: string | undefined = props.user.about;
  
  /**
   * Handles switching between full and short text.
   */
  const handleExpansion: (
  ) => void = (
  ): void => {
    setExpanded(!expanded);
    setTimeout(() => {
      props.updateHeight();
    }, 0);
  }

  return (
    <Grid container>
      {about &&
        <React.Fragment>
          <Grid item xs={12}>
            <Box className={clsx(classes.titleContainer)}>
              <Typography variant='body1' className={clsx(classes.title)}>
                {title}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} className={clsx(classes.container)}>
            <Box
              className={clsx(
                classes.contentContainer, {
                  [classes.contentContainerSmall]: !expanded
                }
              )}
            >
              {about.split('\n').map((item: string, index: number) => {
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
            </Box>
          </Grid>
          <Grid item xs={12} className={clsx(
            classes.showMoreLink, {
              [classes.leftAlign]: props.alignMore === 'left'
            }
          )}>
            <Link onClick={handleExpansion}>{expanded ? 'Show less' : 'Show more'}</Link>
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
};

export default UserDescription;

/**
 * ScrollableReviewCard.tsx
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

// Interfaces.
import { ScrollableReviewCardProps } from './ScrollableReviewCard.interface';

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
      borderBottom: `1px solid rgba(0,0,0,0.2)`,
      borderRadius: 4,
      boxShadow: `0 1px 2px rgba(0,0,0,0.15)`,
      maxWidth: 320,
      width: `calc(100vw * 0.85)`
    },
    cardHeaderContent: {
      maxWidth: '100%',
      padding: theme.spacing(1, 2)
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
      height: 180
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
      padding: theme.spacing(1, 2),
      '&:last-child': {
        paddingBottom: theme.spacing(1),
      }
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
 * Prevents the default link click as redirects are handled by parent elements.
 */
const handleClick: (
  e: React.SyntheticEvent
) => void = (
  e: React.SyntheticEvent
): void => {
  e.preventDefault();
}

/**
 * Review card for public display.
 */
const ScrollableReviewCard: React.FC<ScrollableReviewCardProps> = (props: ScrollableReviewCardProps) => {
  // Define the style classes.
  const classes = useStyles(),
        theme = useTheme();

  return (
    <Card className={classes.cardContainer}>
      <StyledCardHeader
        className={clsx(classes.cardHeaderContent)}
        style={{maxWidth: '100%'}}
        title={
            <Grid container direction='row' style={{flexWrap: 'nowrap', maxWidth: '100%'}}>
              <Grid item style={{flexGrow: 1, minWidth: 0}}>
                {props.user &&
                  <NavLink
                    className={classes.linkText}
                    onClick={handleClick}
                    to={`/review/${props.url}`} 
                  >
                    <Typography variant='body2' className={classes.title}>
                      <Box component='span' className={classes.handleText}>{props.user.handle}</Box> {props.title} 
                    </Typography>
                  </NavLink>
                }
              </Grid>
              <Grid item style={{flexGrow: 0}}>
              </Grid>
            </Grid>
        }
      />
      <CardMedia
        className={clsx(classes.media)}
        image={props.thumbnailURL}
        src='/images/placeholder.png'
        title={`${props.product ? props.product.name : ''} review`}
      />
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
          <Grid item style={{flexGrow: 0, marginLeft: theme.spacing(1)}}>
            <IconButton className={classes.reviewLinkButton}>
              <PlayArrowRoundedIcon color='secondary' className={classes.reviewLinkIcon} />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ScrollableReviewCard;

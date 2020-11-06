/**
 * SideCard.tsx
 * SideCard menu component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import CardUser from '../../raveStream/cardUser/CardUser';
import CardVideo from '../../raveStream/cardVideo/CardVideo';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { Role } from '../../user/User.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { SideCardProps } from './SideCard.interface';

// Utilities.
import { buildURLForStream } from '../../raveStream/RaveStream.common';
import { getExternalAvatar } from '../../user/User.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      border: `2px solid ${theme.palette.common.white}`,
      height: theme.spacing(6),
      width: theme.spacing(6)
    },
    avatarContainer: {
      bottom: theme.spacing(-2), 
      height: theme.spacing(4),
      position: 'absolute',
      right: theme.spacing(2), 
      width: theme.spacing(4),
    },
    avatarIcon: {
      border: `2px solid ${theme.palette.secondary.main}`,
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(6),
      width: theme.spacing(6)
    },
    brandText: {
      display: 'block',
      fontSize: '.85rem',
      fontWeight: 700
    },
    buttonElement: {
      //fontWeight: 700,
      '&.MuiButton-root': {
        //borderRadius: 20
      }
    },
    cardContainer: {
    },
    container: {
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(2)
    },
    divider: {
      margin: theme.spacing(0, 2),
      width: 'calc(100% - 32px)'
    },
    handleText: {
      fontSize: '1rem',
      fontWeight: 600
    },
    handleTextContainer: {
      margin: theme.spacing(0, 1)
    },
    imageContainer: {
      position: 'relative'
    },
    imageHolder: {
      borderRadius: 10,
      height: 0,
      left: 0,
      overflow: 'hidden',
      paddingTop: '75%',
      position: 'absolute',
      top: 0,
      width: '100%'
    },
    image: {
      borderRadius: 10,
      left: 0,
      top: 0,
      width: '100%'
    },
    productContainer: {
      padding: theme.spacing(0, 2, 1)
    },
    productTitle: {
      fontSize: '.9rem',
      fontWeight: 500
    },
    reviewTitle: {
      fontSize: '1rem',
      fontWeight: 600,
      display: `-webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2`,
      lineHeight: '1rem',
      maxHeight: '2rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
    },
    textContainer: {
      padding: theme.spacing(0, 1)
    },
    textItems: {
      height: '100%'
    },
    upNextTitle: {
      fontSize: '1rem',
      fontWeight: 700,
      textTransform: 'uppercase'
    },
    upNextTitleContainer: {
      margin: theme.spacing(0, 0, 2),
    },
    userContainer: {
      padding: theme.spacing(1, 2)
    },
    viewLink: {
      backgroundColor: `rgba(100, 106, 240, 0)`,
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${theme.palette.primary.main}`,
      color: theme.palette.primary.main,
      display: 'inline-block',
      fontWeight: 600,
      lineHeight: '1.75rem',
      padding: theme.spacing(0, 1.5),
      transition: 'background 100ms ease-in-out',
      textDecoration: 'none',
      textTransform: 'uppercase',
      '&:hover': {
        backgroundColor: `rgba(100, 106, 240, .1)`,
      }
    },
  })
);

/**
 * Renders the rave stream card.
 */
const SideCard: React.FC<SideCardProps> = (props: SideCardProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    review,
    streamType
  } = {...props};

  const path: string = buildURLForStream(streamType)(review)(true);

  const firstLetter: string = review && review.user ?
    review.user.handle.substr(0,1) : 'R';

  const avatar: string | undefined = review && review.user ? getExternalAvatar(review.user) : undefined; 

  /**
   * Handles navigation to the rave video.
   *
   * @param { React.SythenticEvent } e - the triggered event.
   */
  const handleNavigate: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    props.history.push(path);
  }

  return (
    <React.Fragment>
      <Grid container className={clsx(classes.container)}>
        {props.next &&
          <Grid item xs={12}
            className={clsx(classes.upNextTitleContainer)}
          >
            <Typography className={clsx(classes.upNextTitle)} variant='h3'>
              Up next
            </Typography>
          </Grid>
        }
        <Grid item xs={4} className={clsx(classes.imageContainer)}>
          <img
            className={clsx(classes.image)}
            src={review.thumbnail} 
            alt={`${review.title}`}
          />
        </Grid>
        <Grid item xs={8}
          className={clsx(classes.textContainer)}
        >
          <Grid container justify='space-between'
            className={clsx(classes.textItems)}
          >
            <Grid item xs={12}>  
              {streamType === RaveStreamType.PRODUCT ? (
                <Typography variant='h4' className={clsx(classes.reviewTitle)}>
                  {review.title}
                </Typography>
              ): (
                <React.Fragment>
                  {review.product &&
                    <Typography variant='h4' className={clsx(classes.productTitle)}>
                      <Box component='span' className={clsx(classes.brandText)}>
                        {review.product.brand.name}
                      </Box>
                      {review.product.name}
                    </Typography>
                  }
                </React.Fragment>
              )}
            </Grid>
            {review.user &&
              <Grid item xs={12}>
                <Grid container alignItems='center'>
                  <Grid item className={clsx(classes.handleTextContainer)}>
                    <Typography
                      className={clsx(classes.handleText)}
                      variant='body1'
                    >
                      {review.user.role === Role.YOUTUBE ? 'youtube' : review.user.handle}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            }
            {/*
            <Grid item xs={12}>
              <NavLink
                className={clsx(classes.viewLink)}
                to={path} 
              >
                View
              </NavLink>
            </Grid>
            */}
          </Grid>
        {/*
        {streamType !== RaveStreamType.PRODUCT &&
          <Grid item xs={12} className={clsx(classes.productContainer)}>
            {review.product &&
              <Typography variant='h3' className={clsx(classes.productTitle)}>
                <Box component='span' className={clsx(classes.brandText)}>
                  {review.product.brand.name}
                </Box>
                {review.product.name}
              </Typography>
            }
          </Grid>
        }
        <Grid item xs={12}>
          <CardVideo
            active={active}
            playing={false}
            review={{...review}}
            url={path}
          />  
        </Grid>
        <Grid item xs={12} className={clsx(classes.userContainer)}>
          <Grid container justify='space-between' alignItems='center'>
            <Grid item>
              <CardUser review={{...review}} />
            </Grid>
            <Grid item>
              <StyledButton
                className={clsx(classes.buttonElement)}
                clickAction={handleNavigate}
                color='primary'
                size='small'
                title='View rave'
              />
            </Grid>
          </Grid>
          */}
        </Grid>
      </Grid>
      {props.next &&
        <Divider className={clsx(classes.divider)} />
      }
    </React.Fragment>
  );
}

export default withRouter(SideCard);

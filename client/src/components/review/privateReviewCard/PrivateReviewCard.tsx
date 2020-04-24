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
import CardMedia from '@material-ui/core/CardMedia';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { NavLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

// Components.
import LinkElement from '../../elements/link/Link';

// Interfaces.
import { PrivateReviewCardProps } from './PrivateReviewCard.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    brandText: {
      display: 'block',
      fontSize: '.7rem',
      fontWeight: 500,
      textTransform: 'uppercase'
    },
    cardContainer: {
      borderRadius: 0,
      boxShadow: 'none'
    },
    divider: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    imageContent: {
      height: 160,
    },
    linkText: {
      color: theme.palette.text.primary,
      textDecoration: 'none'
    },
    productNameText: {
      fontSize: '1.15rem',
      fontWeight: 500
    },
    textContent: {
      paddingBottom: theme.spacing(2),
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: theme.spacing(2),
      '&:last-child': {
        paddingBottom: theme.spacing(2),
      }
    },
    title: {
      fontSize: '1rem',
      marginBottom: theme.spacing(1)
    }
  }),
);

/**
 * Private review card with editable options.
 */
const PrivateReviewCard: React.FC<PrivateReviewCardProps> = (props: PrivateReviewCardProps) => {

  // Define the style classes.
  const classes = useStyles();

  return (
    <Card className={classes.cardContainer}>
      <CardActionArea>
        <CardMedia
          className={classes.imageContent}
          component='img'
          src={props.thumbnailURL}
          title={`${props.product ? props.product.name : ''} review`}
        />
      </CardActionArea>
      <CardContent className={classes.textContent}>
        <Grid container direction='row'>
          {props.product &&
            <Grid item style={{flexGrow: 1}}>
              <NavLink to={`/review/${props.url}`} className={classes.linkText}>
                <Typography variant='body2' className={classes.productNameText}>
                  <Box component='span' className={classes.brandText}>{props.product.brand}</Box> {props.product.name} 
                </Typography>
              </NavLink>
            </Grid>
          }
          <Grid item style={{flexGrow: 0}}>
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PrivateReviewCard;

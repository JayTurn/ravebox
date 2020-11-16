/**
 * DesktopCard.tsx
 * DesktopCard menu component.
 */

// Modules.
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
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import CardUser from '../../raveStream/cardUser/CardUser';
import DesktopCardVideo from '../cardVideo/DesktopCardVideo';
import LinkElement from '../../elements/link/Link';
import ProductTitle from '../../product/title/ProductTitle';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';
import { StyleType } from '../../elements/link/Link.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { DesktopCardProps } from './DesktopCard.interface';

// Utilities.
import { buildURLForStream } from '../../raveStream/RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    container: {
      width: '100%'
    },
    productContainer: {
      padding: theme.spacing(0, 2, 1)
    },
    productTitle: {
      fontSize: '1.1rem',
      fontWeight: 500
    },
    userContainer: {
      padding: theme.spacing(1, 2)
    },
    videoContainer: {
      padding: theme.spacing(1, 2)
    }
  })
);

/**
 * Renders the rave stream card.
 */
const DesktopCard: React.FC<DesktopCardProps> = (props: DesktopCardProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    review,
    streamType
  } = {...props};

  const path: string = buildURLForStream(streamType)(review)(true);

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
    <Grid container className={clsx(classes.container)}>
      {!props.hideProductTitles &&
        <Grid item xs={12} className={clsx(classes.productContainer)}>
          {review.product &&
            <ProductTitle
              linkTitle={true}
              product={{...review.product}} 
              size='small'
              variant='h3'
            />
          }
        </Grid>
      }
      <Grid item xs={12} className={clsx(classes.videoContainer)}>
        {review &&
          <DesktopCardVideo
            review={{...review}}
          />  
        }
      </Grid>
      <Grid item xs={12} className={clsx(classes.userContainer)}>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item>
            <CardUser review={{...review}} />
          </Grid>
          <Grid item>
            <LinkElement
              className={clsx(classes.buttonElement)}
              title='Play rave'
              path={`${path}`}
              size='small'
              styleType={StyleType.BUTTON_PRIMARY}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withRouter(DesktopCard);

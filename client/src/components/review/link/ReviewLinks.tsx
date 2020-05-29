/**
 * ReviewLinks.tsx
 * Renders the review links.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Components.
import LinkElement from '../../elements/link/Link';

// Interfaces.
import { ReviewLinksProps } from './ReviewLinks.interface';
import { ReviewLink } from '../Review.interface';

/**
 * Styles for the wrapping button element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    backgroundColor: `rgba(255,255,255,0.75)`,
    borderRadius: 8,
    padding: theme.spacing(2)
  },
  header: {
    color: '#3E42A3',
    fontSize: '1.1rem',
    fontWeight: 500,
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(2)
  },
  infoText: {
    fontSize: '.9rem',
    margin: theme.spacing(1, 0, 1)
  },
  promoContainer: {
    marginBottom: theme.spacing(1)
  },
  promoText: {
    fontSize: '1.6rem',
    fontWeight: 600,
    lineHeight: 1.3
  },
  promoTitle: {
    fontSize: '.8rem',
    fontWeight: 600,
    //textTransform: 'uppercase'
  }
}));

/*
 * Renders the description component for a review.
 *
 * @param { ReviewDescriptionProps } props - the description properties.
 */
const ReviewLinks: React.FC<ReviewLinksProps> = (
  props: ReviewLinksProps
) => {

  // Use the custom styles.
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12}>
        <Typography
          variant='h3'
          className={clsx(
            classes.header
          )}
        >
          Buy and support {props.handle}
        </Typography>
      </Grid>
      <Grid
        item xs={12}
        className={clsx(
          classes.container
        )}
      >
        {props.links.map((item: ReviewLink, index: number) => {
          return (
            <Grid container direction='column' key={index}>          
              {item.code &&
                <Grid item xs={12} className={clsx(classes.promoContainer)}>
                  <Typography variant='body1' className={clsx(classes.promoTitle)}>
                    Promo / Coupon code
                  </Typography>
                  <Typography variant='body1' className={clsx(classes.promoText)}>
                    {item.code}
                  </Typography>
                </Grid>
              }
              {item.info &&
                <Grid item xs={12}>
                  <Typography variant='body1' className={clsx(classes.infoText)}>
                    {item.info} 
                  </Typography>
                </Grid>
              }
              {item.path &&
                <Grid>
                  <Typography variant='body1'>
                    <Link href={`https://${item.path}`} title={item.info}>{item.path}</Link>
                  </Typography>
                </Grid>
              }
            </Grid>
          )
        })}
      </Grid>
    </Grid>
  );
}
export default ReviewLinks;

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
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(1)
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
      className={clsx(
        classes.container
      )}
    >
      <Grid item xs={12}>
        <Typography
          variant='h3'
          className={clsx(
            classes.header
          )}
        >
          Support {props.handle}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {props.links.map((item: ReviewLink, index: number) => {
          return (
            <React.Fragment key={index}>          
              <Typography variant='body1'>
                {item.title}: <Link href={`https://${item.path}`} title={item.title}>{item.path}</Link>
              </Typography>
            </React.Fragment>
          )
        })}
      </Grid>
    </Grid>
  );
}
export default ReviewLinks;

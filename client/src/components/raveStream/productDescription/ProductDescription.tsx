/**
 * ProductDescription.tsx
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
import { ProductDescriptionProps } from './ProductDescription.interface';
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
      padding: theme.spacing(2)
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
    linkInfoContainer: {
      marginTop: theme.spacing(1),
      padding: theme.spacing(0, 2)
    },
    paragraph: {
      fontSize: '1rem',
      marginBottom: theme.spacing(1),
    },
    showMoreLink: {
      fontSize: '.8rem',
      fontWeight: 500,
      margin: theme.spacing(0, 0, 2),
      textAlign: 'center',
      textTransform: 'uppercase'
    },
    titleContainer: {
      backgroundColor: theme.palette.secondary.dark,
      borderRadius: 10,
      display: 'inline-block',
      margin: theme.spacing(2, 2, 0),
      padding: theme.spacing(0, 1)
    },
    title: {
      color: theme.palette.common.white,
      fontSize: '.75rem',
      fontWeight: 700,
      lineHeight: '1.5rem',
      textTransform: 'uppercase'
    }
  })
);

/**
 * Renders the product images.
 */
const ProductDescription: React.FC<ProductDescriptionProps> = (props: ProductDescriptionProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Set an expanded state for the description content.
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const title: string = props.user && props.user.role !== Role.YOUTUBE
    ? `What ${props.user.handle} says`
    : `What they say`;

  const user: string = props.user && props.user.role !== Role.YOUTUBE
    ? props.user.handle
    : 'the user';

  const reviewLink: ReviewLink | null = props.reviewLinks && props.reviewLinks.length > 0
    ? props.reviewLinks[0] : null;
  
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
      {props.description &&
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
              {props.description.split('\n').map((item: string, index: number) => {
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
          <Grid item xs={12} className={clsx(classes.showMoreLink)}>
            <Link onClick={handleExpansion}>{expanded ? 'Show less' : 'Show more'}</Link>
          </Grid>
        </React.Fragment>
      }
      {reviewLink && reviewLink.path &&
        <React.Fragment>
          {reviewLink.code &&
            <Grid item xs={12}>
              <Box className={clsx(classes.titleContainer)}>
                <Typography variant='body1' className={clsx(classes.title)}>
                  Promo from {user}
                </Typography>
              </Box>
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
              className={clsx(classes.buyButton)}
              href={`https://${reviewLink.path}`} 
              target='_blank'
            >
              Buy
            </Link>
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
};

export default ProductDescription;

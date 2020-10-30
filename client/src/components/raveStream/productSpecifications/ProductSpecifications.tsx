/**
 * ProductSpecifications.tsx
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
import { ProductSpecificationsProps } from './ProductSpecifications.interface';
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
    paragraph: {
      fontSize: '.9rem',
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
const ProductSpecifications: React.FC<ProductSpecificationsProps> = (props: ProductSpecificationsProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Set an expanded state for the specifications content.
  const [expanded, setExpanded] = React.useState<boolean>(false);
  
  /**
   * Handles switching between full and short text.
   */
  const handleExpansion: (
  ) => void = (
  ): void => {
    setExpanded(!expanded);
  }

  return (
    <Grid container>
      {props.description &&
        <React.Fragment>
          <Grid item xs={12}>
            <Box className={clsx(classes.titleContainer)}>
              <Typography variant='body1' className={clsx(classes.title)}>
                Product information
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
      {props.website &&
        <Grid item xs={12} className={clsx(classes.buyButtonContainer)}>
          <Link
            className={clsx(classes.buyButton)}
            href={`https://${props.website}`} 
            target='_blank'
          >
            Official website
          </Link>
        </Grid>
      }
    </Grid>
  );
};

export default ProductSpecifications;

/**
 * About.tsx
 * About screen route component.
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
import { Helmet } from 'react-helmet';
import LinkElement from '../../components/elements/link/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Enumerators.
import { StyleType } from '../../components/elements/link/Link.enum';

// Interfaces.
import { AboutProps } from './About.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: theme.spacing(4)
    },
    container: {
      padding: theme.spacing(4, 2, 6),
    },
    containerLarge: {
      padding: theme.spacing(12, 2, 16)
    },
    containerText: {
      fontSize: '1.4rem',
      fontWeight: 500,
      marginBottom: theme.spacing(4),
      textAlign: 'center'
    },
    containerTextLarge: {
      fontSize: '1.6rem'
    },
    containerTitle: {
      fontSize: '2rem',
      fontWeight: 300,
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    containerTitleLarge: {
      fontSize: '2.5rem'
    },
    heavyTitle: {
      fontWeight: 700
    },
    primaryHighlight: {
      color: theme.palette.primary.main,
      fontWeight: 600
    },
    primaryContainer: {
      backgroundColor: theme.palette.primary.dark,
    },
    primaryContainerText: {
      color: theme.palette.common.white
    },
    primaryContainerTitle: {
    },
    secondaryContainer: {
      backgroundColor: theme.palette.secondary.dark,
    },
    secondaryContainerText: {
      color: theme.palette.common.white,
      textShadow: `0 1px 1px rgba(0,32,27,0.2)`
    },
    whiteContainer: {
      backgroundColor: theme.palette.common.white,
    },
    whiteContainerText: {
    }
  })
);

/**
 * About route component.
 */
const About: React.FC<AboutProps> = (props: AboutProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  /**
   * Render the about JSX elements.
   */
  return (
    <Grid
      container
      direction='column'
    >
      <Helmet>
        <title>About ravebox - ravebox</title>
        <link rel='canonical' href='https://ravebox.io/about' />
      </Helmet>
      <Grid item xs={12} className={clsx(
          classes.container,
          classes.whiteContainer,
          {
            [classes.containerLarge]: largeScreen
          }
        )}
      >
        <Typography variant='h1' className={clsx(
            classes.containerTitle,
            classes.whiteContainerText,
            {
              [classes.containerTitleLarge]: largeScreen
            }
          )}
        >
          Discover and share <Box component='span' className={classes.primaryHighlight}>real</Box> product experiences.</Typography>
      </Grid>
      <Grid item xs={12} className={clsx(
          classes.container,
          classes.primaryContainer,
          {
            [classes.containerLarge]: largeScreen
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12} md={9}>
            <Typography variant='h2' className={clsx(
                classes.containerTitle,
                classes.primaryContainerText,
                {
                  [classes.containerTitleLarge]: largeScreen
                }
              )}
            >
              <Box component='span' className={classes.heavyTitle}>Every product reviewed,</Box> 2 minutes or less.
            </Typography>
            <Typography variant='body1' className={clsx(
                classes.containerText,
                classes.primaryContainerText,
                {
                  [classes.containerTextLarge]: largeScreen
                }
              )}
            >
              Raves are kept short so you can find a broad range of product experiences and recommendations in one place.
            </Typography>
            <Typography variant='body1' className={clsx(
                classes.containerText,
                classes.primaryContainerText,
                {
                  [classes.containerTextLarge]: largeScreen
                }
              )}
            >
              Learn, compare and discover.
            </Typography>
          </Grid>
          <Grid item xs={12} className={clsx(
              classes.buttonContainer
            )}
          >
            <LinkElement
              path={'/discover'}
              styleType={StyleType.BUTTON_PRIMARY_INVERSE}
              title='Find products'
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={clsx(
          classes.container,
          classes.whiteContainer,
          {
            [classes.containerLarge]: largeScreen
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12} md={9}>
            <Typography variant='h2' className={clsx(
                classes.containerTitle,
                classes.whiteContainerText,
                {
                  [classes.containerTitleLarge]: largeScreen
                }
              )}
            >
              <Box component='span' className={classes.heavyTitle}>Come for the products</Box>. Stay for the people.
            </Typography>
            <Typography variant='body1' className={clsx(
                classes.containerText,
                classes.whiteContainerText,
                {
                  [classes.containerTextLarge]: largeScreen
                }
              )}
            >
              Raves are more than product reviews, they’re personal experiences. Discover ravers that talk about products in  a way you can relate to.
            </Typography>
            <Typography variant='body1' className={clsx(
                classes.containerText,
                classes.whiteContainerText,
                {
                  [classes.containerTextLarge]: largeScreen
                }
              )}
            >
              Follow ravers for advice and recommendations.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={clsx(
          classes.container,
          classes.secondaryContainer,
          {
            [classes.containerLarge]: largeScreen
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12} md={9}>
            <Typography variant='h2' className={clsx(
                classes.containerTitle,
                classes.secondaryContainerText,
                {
                  [classes.containerTitleLarge]: largeScreen
                }
              )}
            >
              <Box component='span' className={classes.heavyTitle}>If you've experienced it,</Box> you can rave about it
            </Typography>
            <Typography variant='body1' className={clsx(
                classes.containerText,
                classes.secondaryContainerText,
                {
                  [classes.containerTextLarge]: largeScreen
                }
              )}
            >
              There's no limit to what you can review and how you share your story. We’ll help you build a community that counts on you for authentic experiences and advice.
            </Typography>
            <Typography variant='body1' className={clsx(
                classes.containerText,
                classes.secondaryContainerText,
                {
                  [classes.containerTextLarge]: largeScreen
                }
              )}
            >
              Anyone can become a raver.
            </Typography>
          </Grid>
          <Grid item xs={12} className={clsx(
              classes.buttonContainer
            )}
          >
            <LinkElement
              path={'/product/add'}
              styleType={StyleType.BUTTON_SECONDARY_INVERSE}
              title='Post a rave'
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default About;

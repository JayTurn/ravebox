/**
 * ContentBlock.tsx
 * ContentBlock component.
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
import LinkElement from '../../elements/link/Link';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Enumerators.
import { ColorStyle } from './ContentBlock.enum';
import { StyleType } from '../../elements/link/Link.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import { ContentBlockProps } from './ContentBlock.interface';

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
      padding: theme.spacing(12, 12, 16)
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
 * Renders the content block.
 */
const ContentBlock: React.FC<ContentBlockProps> = (props: ContentBlockProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  /**
   * Render the JSX elements.
   */
  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} className={clsx(
          classes.container,
          {
            [classes.whiteContainer]: props.background === ColorStyle.WHITE,
            [classes.primaryContainer]: props.background === ColorStyle.PRIMARY,
            [classes.secondaryContainer]: props.background === ColorStyle.SECONDARY,
            [classes.containerLarge]: largeScreen
          }
        )}
      >
        {props.title &&
          <React.Fragment>
            <Typography variant='h1' className={clsx(
                classes.containerTitle,
                {
                  [classes.whiteContainerText]: props.background === ColorStyle.WHITE,
                  [classes.primaryContainerText]: props.background === ColorStyle.PRIMARY,
                  [classes.secondaryContainerText]: props.background === ColorStyle.SECONDARY,
                  [classes.containerTitleLarge]: largeScreen
                }
              )}
            >
              {props.title}
            </Typography>
          </React.Fragment>
        }
        {props.bodyFirst &&
          <Typography variant='body1' className={clsx(
              classes.containerText,
              {
                [classes.whiteContainerText]: props.background === ColorStyle.WHITE,
                [classes.primaryContainerText]: props.background === ColorStyle.PRIMARY,
                [classes.secondaryContainerText]: props.background === ColorStyle.SECONDARY,
                [classes.containerTextLarge]: largeScreen
              }
            )}
          >
            {props.bodyFirst}
          </Typography>
        }
        {props.bodySecond &&
          <Typography variant='body1' className={clsx(
              classes.containerText,
              {
                [classes.whiteContainerText]: props.background === ColorStyle.WHITE,
                [classes.primaryContainerText]: props.background === ColorStyle.PRIMARY,
                [classes.secondaryContainerText]: props.background === ColorStyle.SECONDARY,
                [classes.containerTextLarge]: largeScreen
              }
            )}
          >
            {props.bodySecond}
          </Typography>
        }
      </Grid>
    </Grid>
  );
};

export default ContentBlock;

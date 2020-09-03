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
    columnContainer: {
      flexWrap: 'nowrap'
    },
    container: {
      padding: theme.spacing(4, 2, 6),
    },
    containerLarge: {
      padding: theme.spacing(8, 4, 12)
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
    reducedBottomMargin: {
      paddingBottom: theme.spacing(6)
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
 * Sets the button style type based on the background.
 *
 * @param { ColorStyle } colorStyle - the color style used.
 *
 * @return StyleType
 */
const setButtonStyle: (
  colorStyle: ColorStyle
) => StyleType = (
  colorStyle: ColorStyle
): StyleType => {
  let styleType: StyleType = StyleType.BUTTON_PRIMARY;

  switch (colorStyle) {
    case ColorStyle.PRIMARY:
      styleType = StyleType.BUTTON_PRIMARY_INVERSE;
      break;
    case ColorStyle.SECONDARY:
      styleType = StyleType.BUTTON_SECONDARY_INVERSE
      break;
    default:
  }

  return styleType;
}

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

  // Define the button style to be used if it exists.
  const buttonStyle: StyleType = setButtonStyle(props.background);

  /**
   * Render the JSX elements.
   */
  return (
    <Grid
      container
      direction='column'
      className={classes.columnContainer}
    >
      <Grid item xs={12} className={clsx(
          classes.container,
          {
            [classes.whiteContainer]: props.background === ColorStyle.WHITE,
            [classes.primaryContainer]: props.background === ColorStyle.PRIMARY,
            [classes.secondaryContainer]: props.background === ColorStyle.SECONDARY,
            [classes.containerLarge]: largeScreen,
            [classes.reducedBottomMargin]: props.reducedBottomMargin
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12} md={9}>
            {props.title &&
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
                    [classes.containerTextLarge]: largeScreen,
                  }
                )}
              >
                {props.bodySecond}
              </Typography>
            }
          </Grid>
          {props.action &&
            <Grid item xs={12} className={clsx(
                classes.buttonContainer
              )}
            >
              <LinkElement
                path={props.action.path}
                styleType={buttonStyle}
                title={props.action.title}
              />
            </Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContentBlock;

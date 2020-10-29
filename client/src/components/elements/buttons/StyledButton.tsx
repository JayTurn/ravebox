/**
 * StyledButton.tsx
 * Styled button re-used across the application.
 */

// Modules.
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as React from 'react';

// Interfaces.
import { StyledButtonProps } from './StyledButton.interface';

/**
 * Styles for the wrapping button element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -10,
      marginLeft: -12
    },
    floatLeft: {
      'float': 'left'
    },
    floatNone: {
      'float': 'none'
    },
    floatRight: {
      'float': 'right'
    },
    wrapper: {
      position: 'relative',
      display: 'inline-block'
    }
  })
);

/**
 * Circular progress spinner.
 */
const StyledCircularProgress = withStyles(theme => ({
  root: { },
  colorPrimary: {
    color: theme.palette.primary.contrastText,
  }
}))(CircularProgress);

/**
 * Button styles.
 */
const VerticalButtonElement = withStyles(theme => ({
  root: {
    cursor: 'pointer',
    fontWeight: 600,
    '&:disabled': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      opacity: '.45'
    }
  }
}))(Button);

const HorizontalButtonElement = withStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    cursor: 'pointer',
    fontSize: '.9rem',
    backgroundColor: theme.palette.common.white,
    boxShadow: `0 0 0 1px inset ${theme.palette.primary.main}`,
    '&:hover': {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
    },
    '&:disabled': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.common.white,
      boxShadow: `0 0 0 1px inset ${theme.palette.primary.main}`,
      opacity: '.45'
    }
  },
  label: {
    lineHeight: 2.75
  }
}))(Button);


/**
 * Styled button component.
 */
const StyledButton: React.FC<StyledButtonProps> = (props: StyledButtonProps) => {
  // Use the custom styles.
  const classes = useStyles();

  const buttonColor = props.color ? props.color : 'primary';

  return (
    <div className={clsx(
      classes.wrapper, {
      [classes.floatLeft]: !props.align || props.align === 'left',
      [classes.floatRight]: props.align === 'right',
      [classes.floatNone]: props.align === 'none'
    })}>
      {props.orientation && props.orientation === 'inline' ? (
        <React.Fragment>
          <HorizontalButtonElement
            className={props.className}
            color={buttonColor}
            disabled={props.disabled || props.submitting}
            disableElevation
            size='large'
            fullWidth={true}
            onClick={props.clickAction}
            variant={props.variant ? props.variant : 'contained'}
          >
            {props.title}
          </HorizontalButtonElement>
          {props.submitting &&
            <StyledCircularProgress
              className={classes.buttonProgress}
              size='1.25rem'
              thickness={4}
            />
          }
        </React.Fragment>
      ) : (
        <React.Fragment>
          <VerticalButtonElement
            className={props.className}
            color={buttonColor}
            disabled={props.disabled || props.submitting}
            disableElevation
            fullWidth={true}
            onClick={props.clickAction}
            size={props.size}
            variant={props.variant ? props.variant : 'contained'}
          >
            {props.title}
          </VerticalButtonElement>
          {props.submitting &&
            <StyledCircularProgress
              className={classes.buttonProgress}
              size='1.25rem'
              thickness={4}
            />
          }
        </React.Fragment>
      )}
    </div>
  );
};

export default StyledButton;

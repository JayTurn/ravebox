/**
 * StyledButton.tsx
 * Styled button re-used across the application.
 */

// Modules.
import * as React from 'react';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    wrapper: {
      float: 'left',
      position: 'relative'
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
    <div className={classes.wrapper}>
      {props.orientation && props.orientation === 'inline' ? (
        <React.Fragment>
          <HorizontalButtonElement
            color={buttonColor}
            disabled={props.disabled || props.submitting}
            disableElevation
            size='large'
            fullWidth={true}
            onClick={props.clickAction}
            variant='contained'
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
            color={buttonColor}
            disabled={props.disabled || props.submitting}
            disableElevation
            fullWidth={true}
            onClick={props.clickAction}
            size={props.size}
            variant='contained'
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

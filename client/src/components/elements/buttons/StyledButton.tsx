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
    root: {},
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
const ButtonElement = withStyles(theme => ({
  root: {
    '&:disabled': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      opacity: '.45'
    }
  }
}))(Button);


/**
 * Styled button component.
 */
const StyledButton: React.FC<StyledButtonProps> = (props: StyledButtonProps) => {
  // Use the custom styles.
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <ButtonElement
        color='primary'
        disabled={props.disabled || props.submitting}
        disableElevation
        fullWidth={true}
        onClick={props.clickAction}
        variant='contained'
      >
        {props.title}
      </ButtonElement>
      {props.submitting &&
        <StyledCircularProgress
          className={classes.buttonProgress}
          size='1.25rem'
          thickness={4}
        />
      }
    </div>
  );
};

export default StyledButton;

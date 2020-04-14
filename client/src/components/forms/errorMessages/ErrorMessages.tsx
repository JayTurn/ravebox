/**
 * ErrorMessages.tsx
 * Error messages form section.
 */
import React from 'react';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Collapse from '@material-ui/core/Collapse';
import Divider from '@material-ui/core/Divider';
import { withStyles, Theme } from '@material-ui/core/styles';

// Interfaces.
import { ErrorMessagesProps } from './ErrorMessages.interface';

/**
 * Alert error messages.
 */
const StyledErrorAlert = withStyles((theme: Theme) => ({
  root: { },
  message: {
    flexGrow: 1
  }
}))(Alert);

/**
 * Styled error divider.
 */
const StyledDivider = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.error.main,
    opacity: '.15',
    marginBottom: 5,
    marginTop: 5
  }
}))(Divider);

/**
 * Displays error messages section.
 *
 */
const ErrorMessages: React.FC<ErrorMessagesProps> = (props: ErrorMessagesProps) => {
  const show: boolean = props.errors.length > 0 && props.errors[0] ? true : false;
  return(
    <Collapse in={show}>
      <Box style={{marginBottom: 20}}>
        <StyledErrorAlert severity='error'>
          {props.title &&
            <AlertTitle>{props.title}</AlertTitle>
          }
          {
            props.errors.map((error: string, index: number) => {
              const showDivider: boolean = index !== props.errors.length - 1;
              return(
                <React.Fragment key={index}>
                  <Box>
                    {`${error}`}
                  </Box>
                  {showDivider &&
                    <StyledDivider />
                  }
                </React.Fragment>
              )
            })
          }
        </StyledErrorAlert>
      </Box>
    </Collapse>
  );
}

export default ErrorMessages;
